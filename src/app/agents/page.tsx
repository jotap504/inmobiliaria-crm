'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Home
} from 'lucide-react';

// Mock data - en producción vendría de Supabase
const mockAgents = [
  {
    id: '1',
    name: 'María García',
    email: 'maria@inmobiliaria.com',
    phone: '+54 11 5555-1234',
    role: 'agent',
    broker_id: 'broker1',
    commission: 3,
    active_properties: 8,
    sales_closed: 12,
    total_commission: 45000,
    created_at: '2023-01-15T10:00:00Z',
    last_login: '2024-01-22T09:15:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos@inmobiliaria.com',
    phone: '+54 11 5555-5678',
    role: 'agent',
    broker_id: 'broker1',
    commission: 2.5,
    active_properties: 5,
    sales_closed: 8,
    total_commission: 28000,
    created_at: '2023-03-20T14:30:00Z',
    last_login: '2024-01-21T16:45:00Z',
    status: 'active',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana@inmobiliaria.com',
    phone: '+54 11 5555-9012',
    role: 'agent',
    broker_id: 'broker1',
    commission: 3.5,
    active_properties: 12,
    sales_closed: 15,
    total_commission: 62000,
    created_at: '2022-11-10T11:20:00Z',
    last_login: '2024-01-22T11:30:00Z',
    status: 'active',
  },
  {
    id: '4',
    name: 'Roberto Silva',
    email: 'roberto@inmobiliaria.com',
    phone: '+54 11 5555-3456',
    role: 'agent',
    broker_id: 'broker1',
    commission: 4,
    active_properties: 3,
    sales_closed: 6,
    total_commission: 24000,
    created_at: '2023-06-05T09:00:00Z',
    last_login: '2024-01-20T14:20:00Z',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Laura Fernández',
    email: 'laura@inmobiliaria.com',
    phone: '+54 11 5555-7890',
    role: 'agent',
    broker_id: 'broker1',
    commission: 3,
    active_properties: 7,
    sales_closed: 10,
    total_commission: 35000,
    created_at: '2023-02-28T16:45:00Z',
    last_login: '2024-01-21T10:15:00Z',
    status: 'active',
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactivo</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspendido</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'broker':
        return <Badge className="bg-purple-100 text-purple-800">Broker</Badge>;
      case 'agent':
        return <Badge className="bg-blue-100 text-blue-800">Agente</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone.includes(searchTerm)
  );

  const handleAgentClick = (agentId: string) => {
    console.log('Agent clicked:', agentId);
    // Redirigir a la página de detalle del agente
    // window.location.href = `/agents/${agentId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Vendedores
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar vendedores..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Navigation */}
              <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </a>
              <a href="/properties" className="text-sm text-gray-600 hover:text-gray-900">
                <Home className="h-4 w-4 mr-2" />
                Propiedades
              </a>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Vendedor
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendedores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents.length}</div>
              <p className="text-xs text-muted-foreground">
                {agents.filter(a => a.status === 'active').length} activos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agents.reduce((sum, agent) => sum + agent.sales_closed, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comisiones Generadas</CardTitle>
              <span className="text-2xl font-bold text-green-600">$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${agents.reduce((sum, agent) => sum + agent.total_commission, 0).toLocaleString('es-AR')}
              </div>
              <p className="text-xs text-muted-foreground">Acumulado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propiedades Activas</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {agents.reduce((sum, agent) => sum + agent.active_properties, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Asignadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {agent.email}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(agent.status)}
                    {getRoleBadge(agent.role)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{agent.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{agent.email}</span>
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Propiedades:</span>
                        <span className="font-semibold ml-1">{agent.active_properties}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Ventas:</span>
                        <span className="font-semibold ml-1">{agent.sales_closed}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Comisión:</span>
                        <span className="font-semibold ml-1">{agent.commission}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-green-600 ml-1">
                          ${agent.total_commission.toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div className="text-xs text-gray-500 border-t pt-2">
                    Último acceso: {new Date(agent.last_login).toLocaleDateString('es-AR')}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAgentClick(agent.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Ver Detalle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => console.log('Edit agent:', agent.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => console.log('Delete agent:', agent.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron vendedores
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'No hay vendedores que coincidan con tu búsqueda.'
                : 'No hay vendedores registrados aún.'
              }
            </p>
            {!searchTerm && (
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Vendedor
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
