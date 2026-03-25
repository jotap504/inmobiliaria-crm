'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Home,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserPlus,
  Crown
} from 'lucide-react';
import Navigation from '@/components/navigation';
import { usePermissions } from '@/contexts/AuthContext';
import { mockUsers, getSupervisorTeam, User } from '@/lib/auth';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser, isAdmin, canManageUsers } = usePermissions();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-50 text-green-700 text-xs px-2 py-0.5">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-red-50 text-red-700 text-xs px-2 py-0.5">Inactivo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5">Pendiente</Badge>;
      default:
        return <Badge variant="outline" className="text-xs px-2 py-0.5">Desconocido</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5">Administrador</Badge>;
      case 'supervisor':
        return <Badge className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5">Supervisor</Badge>;
      case 'seller':
        return <Badge className="bg-green-50 text-green-700 text-xs px-2 py-0.5">Vendedor</Badge>;
      default:
        return <Badge variant="outline" className="text-xs px-2 py-0.5">{role}</Badge>;
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const supervisorTeam = getSupervisorTeam(currentUser?.id || '');

  if (!canManageUsers) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Regresar al Dashboard
            </Button>
          </div>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Restringido</h3>
              <p className="text-gray-600">
                No tienes permisos para gestionar usuarios. Esta función está disponible solo para administradores.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="flex items-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Regresar al Dashboard
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="sm" className="h-9 px-3 text-xs">
              <UserPlus className="h-3 w-3 mr-1" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Crown className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {users.filter(u => u.role === 'admin').length}
                  </h3>
                  <p className="text-xs text-gray-500">Administradores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {users.filter(u => u.role === 'supervisor').length}
                  </h3>
                  <p className="text-xs text-gray-500">Supervisores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {users.filter(u => u.role === 'seller').length}
                  </h3>
                  <p className="text-xs text-gray-500">Vendedores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {users.filter(u => u.status === 'active').length}
                  </h3>
                  <p className="text-xs text-gray-500">Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Lista de Usuarios</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-1">No se encontraron usuarios</h3>
                <p className="text-sm text-gray-500">No hay usuarios que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-medium text-blue-600">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900">{user.name}</h3>
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {user.joinDate}
                          </span>
                        </div>
                        {user.properties && (
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Propiedades: {user.properties.length}</span>
                            <span>Ventas: {user.properties.filter(p => p.status === 'sold').length}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        {isAdmin && user.role !== 'admin' && (
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => console.log('View user:', user.id)}
                              className="h-8 px-3 text-xs"
                            >
                              Ver Detalle
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => console.log('Edit user:', user.id)}
                              className="h-8 px-3 text-xs"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => console.log('Delete user:', user.id)}
                              className="h-8 px-3 text-xs"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
