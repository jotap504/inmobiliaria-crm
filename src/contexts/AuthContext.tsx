'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthContextType, Permission, getPermissions, canEditProperty, mockLogin, mockUsers } from '@/lib/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (localStorage, cookie, etc.)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await mockLogin(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission: keyof Permission): boolean => {
    if (!user) return false;
    const permissions = getPermissions(user.role);
    return permissions[permission];
  };

  const canEditThisProperty = (property: any): boolean => {
    if (!user) return false;
    return canEditProperty(user, property, mockUsers);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    canEditThisProperty,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook para verificar permisos específicos
export function usePermissions() {
  const { user, hasPermission, logout } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  const isSupervisor = user?.role === 'supervisor';
  const isSeller = user?.role === 'seller';
  
  return {
    user,
    isAdmin,
    isSupervisor,
    isSeller,
    hasPermission,
    logout,
    canViewAll: hasPermission('canViewAllProperties'),
    canEditAll: hasPermission('canEditAllProperties'),
    canCreate: hasPermission('canCreateProperties'),
    canDelete: hasPermission('canDeleteProperties'),
    canManageUsers: hasPermission('canManageUsers'),
    canAssign: hasPermission('canAssignProperties'),
    canManageDocs: hasPermission('canManageDocuments'),
    canAssignTasks: hasPermission('canAssignTasks'),
  };
}
