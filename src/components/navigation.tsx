'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Building, Settings, Menu, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { usePermissions } from '@/contexts/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, canManageUsers, hasPermission, logout } = usePermissions();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      current: pathname === '/',
    },
    {
      name: 'Propiedades',
      href: '/properties',
      icon: Building,
      current: pathname === '/properties' || pathname.startsWith('/properties/'),
    },
    {
      name: 'Vendedores',
      href: '/sellers',
      icon: Users,
      current: pathname === '/sellers',
    },
    {
      name: 'Usuarios',
      href: '/users',
      icon: Shield,
      current: pathname === '/users',
      show: canManageUsers,
    },
  ].filter(item => item.show !== false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <Home className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">
                CRM Inmobiliario
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                      item.current
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center">
            <div className="hidden sm:ml-4 sm:flex sm:items-center">
              {user && (
                <div className="flex items-center space-x-3 mr-4">
                  <span className="text-sm text-gray-600">
                    Bienvenido, <span className="font-medium">{user.name}</span>
                  </span>
                  <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 text-xs"
                onClick={logout}
              >
                <LogOut className="h-3 w-3 mr-1" />
                Cerrar Sesión
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-8 w-8 p-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 pt-2 pb-3">
            <div className="space-y-1">
              {user && (
                <div className="px-3 py-2 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {user.name}
                    </span>
                  </div>
                </div>
              )}
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 px-3">
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs w-full">
                <Settings className="h-3 w-3 mr-1" />
                Configuración
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
