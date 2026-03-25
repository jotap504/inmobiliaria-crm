'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Users, FileText, TrendingUp, Calendar, Plus, Building } from 'lucide-react';
import Navigation from '@/components/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  // Mock data - replace with real data from Supabase
  const mockTimelineEvents = [
    {
      id: '1',
      transaction_id: '1',
      type: 'contact' as const,
      title: 'Contacto inicial con cliente',
      description: 'Cliente interesado en departamento de 2 ambientes en Palermo',
      date: '2024-01-15T10:00:00Z',
      priority: 'high' as const,
      agent_id: '1',
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      transaction_id: '1',
      type: 'documentation' as const,
      title: 'Documentación del vendedor completa',
      description: 'Se recibió toda la documentación necesaria del propietario',
      date: '2024-01-18T14:30:00Z',
      priority: 'medium' as const,
      agent_id: '1',
      created_at: '2024-01-18T14:30:00Z',
    },
  ];

  const stats = [
    {
      title: 'Propiedades Activas',
      value: '24',
      change: '+3 este mes',
      icon: Building,
      color: 'text-blue-600',
    },
    {
      title: 'Clientes en Pipeline',
      value: '18',
      change: '+5 este mes',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Ventas Cerradas',
      value: '6',
      change: '+2 este mes',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Documentación Pendiente',
      value: '12',
      change: '-4 esta semana',
      icon: FileText,
      color: 'text-orange-600',
    },
  ];

  const recentProperties = [
    {
      id: '1',
      title: 'Departamento 2 ambientes - Palermo',
      price: '$120,000',
      status: 'available',
      visits: 8,
      interested: 3,
    },
    {
      id: '2',
      title: 'Casa 3 ambientes - Belgrano',
      price: '$280,000',
      status: 'reserved',
      visits: 15,
      interested: 7,
    },
    {
      id: '3',
      title: 'Studio - Recoleta',
      price: '$85,000',
      status: 'available',
      visits: 5,
      interested: 2,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-50 text-green-700 text-xs px-2 py-0.5">Disponible</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5">Reservado</Badge>;
      case 'sold':
        return <Badge className="bg-red-50 text-red-700 text-xs px-2 py-0.5">Vendido</Badge>;
      default:
        return <Badge variant="outline" className="text-xs px-2 py-0.5">Desconocido</Badge>;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Timeline de Procesos</CardTitle>
                  <CardDescription className="text-sm">
                    Seguimiento de las operaciones en curso
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {mockTimelineEvents.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{event.title}</h4>
                          <p className="text-xs text-gray-600">{event.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(event.date).toLocaleDateString('es-AR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Properties */}
            <div>
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Propiedades Recientes</CardTitle>
                  <CardDescription className="text-sm">
                    Últimas propiedades agregadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {recentProperties.map((property) => (
                      <div
                        key={property.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium truncate">{property.title}</h4>
                          <p className="text-lg font-bold text-blue-600">{property.price}</p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                            <span>{property.visits} visitas</span>
                            <span>{property.interested} interesados</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          {getStatusBadge(property.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Ver todas las propiedades
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
