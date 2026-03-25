// Tipos de usuarios y permisos
export type UserRole = 'admin' | 'supervisor' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  commission?: number;
  supervisorId?: string; // Para vendedores asignados a un supervisor
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin?: string;
}

export interface Permission {
  canViewAllProperties: boolean;
  canEditAllProperties: boolean;
  canCreateProperties: boolean;
  canDeleteProperties: boolean;
  canManageUsers: boolean;
  canAssignProperties: boolean;
  canManageDocuments: boolean;
  canAssignTasks: boolean;
}

// Mock users para demostración
export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Administrador Principal',
    email: 'admin@inmobiliaria.com',
    phone: '+54 11 5555-0000',
    role: 'admin',
    status: 'active',
    joinDate: '2023-01-01T00:00:00Z',
  },
  {
    id: 'supervisor1',
    name: 'Roberto Silva',
    email: 'roberto.silva@inmobiliaria.com',
    phone: '+54 11 5555-3456',
    role: 'supervisor',
    commission: 3.5,
    status: 'active',
    joinDate: '2023-03-15T00:00:00Z',
  },
  {
    id: 'supervisor2',
    name: 'Laura Martínez',
    email: 'laura.martinez@inmobiliaria.com',
    phone: '+54 11 5555-7890',
    role: 'supervisor',
    commission: 3.5,
    status: 'active',
    joinDate: '2023-05-20T00:00:00Z',
  },
  {
    id: 'seller1',
    name: 'María García',
    email: 'maria.garcia@inmobiliaria.com',
    phone: '+54 11 5555-1234',
    role: 'seller',
    commission: 3,
    supervisorId: 'supervisor1',
    status: 'active',
    joinDate: '2023-06-10T00:00:00Z',
  },
  {
    id: 'seller2',
    name: 'Carlos López',
    email: 'carlos.lopez@inmobiliaria.com',
    phone: '+54 11 5555-5678',
    role: 'seller',
    commission: 3,
    supervisorId: 'supervisor1',
    status: 'active',
    joinDate: '2023-07-15T00:00:00Z',
  },
  {
    id: 'seller3',
    name: 'Ana Fernández',
    email: 'ana.fernandez@inmobiliaria.com',
    phone: '+54 11 5555-9012',
    role: 'seller',
    commission: 2.5,
    supervisorId: 'supervisor2',
    status: 'active',
    joinDate: '2023-08-20T00:00:00Z',
  },
];

// Función para obtener permisos según rol
export function getPermissions(role: UserRole): Permission {
  switch (role) {
    case 'admin':
      return {
        canViewAllProperties: true,
        canEditAllProperties: true,
        canCreateProperties: true,
        canDeleteProperties: true,
        canManageUsers: true,
        canAssignProperties: true,
        canManageDocuments: true,
        canAssignTasks: true,
      };
    
    case 'supervisor':
      return {
        canViewAllProperties: true,
        canEditAllProperties: false, // Solo su área
        canCreateProperties: true,
        canDeleteProperties: false, // Solo su área
        canManageUsers: false,
        canAssignProperties: true, // A sus vendedores
        canManageDocuments: true,
        canAssignTasks: true, // A sus vendedores
      };
    
    case 'seller':
      return {
        canViewAllProperties: true,
        canEditAllProperties: false, // Solo su área
        canCreateProperties: true,
        canDeleteProperties: false, // Solo su área
        canManageUsers: false,
        canAssignProperties: false,
        canManageDocuments: true,
        canAssignTasks: false,
      };
    
    default:
      return {
        canViewAllProperties: false,
        canEditAllProperties: false,
        canCreateProperties: false,
        canDeleteProperties: false,
        canManageUsers: false,
        canAssignProperties: false,
        canManageDocuments: false,
        canAssignTasks: false,
      };
  }
}

// Función para verificar si un usuario puede modificar una propiedad
export function canEditProperty(user: User, property: any, allUsers: User[]): boolean {
  const permissions = getPermissions(user.role);
  
  // Admin puede editar todo
  if (permissions.canEditAllProperties) {
    return true;
  }
  
  // Supervisor puede editar sus propiedades y las de sus vendedores
  if (user.role === 'supervisor') {
    const isOwner = property.created_by === user.id;
    const isFromSeller = property.assigned_agents?.includes((agentId: string) => {
      const seller = allUsers.find(u => u.id === agentId);
      return seller?.role === 'seller' && seller.supervisorId === user.id;
    });
    return isOwner || isFromSeller;
  }
  
  // Vendedor puede editar solo sus propiedades asignadas
  if (user.role === 'seller') {
    return property.assigned_agents?.includes(user.id) || property.created_by === user.id;
  }
  
  return false;
}

// Función para obtener el equipo de un supervisor
export function getSupervisorTeam(supervisorId: string, allUsers: User[]): User[] {
  return allUsers.filter(user => user.supervisorId === supervisorId);
}

// Función para obtener el supervisor de un vendedor
export function getSellerOfUser(sellerId: string, allUsers: User[]): User | undefined {
  return allUsers.find(user => user.id === sellerId && user.role === 'supervisor');
}

// Context de autenticación
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: keyof Permission) => boolean;
  canEditThisProperty: (property: any) => boolean;
}

// Mock de autenticación
export async function mockLogin(email: string, password: string): Promise<User | null> {
  // Simulación de login
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'demo123') {
    return { ...user, lastLogin: new Date().toISOString() };
  }
  return null;
}
