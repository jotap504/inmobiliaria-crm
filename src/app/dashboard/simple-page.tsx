'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timeline } from '@/components/ui/timeline';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Plus, 
  Bell,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';

export default function DashboardSimplePage() {
  // Mock data - en producción vendría de Supabase
  const mockTimelineEvents = [
    {
      id: '1',
      transaction_id: '1',
      type: 'contact',
      title: 'Contacto inicial con cliente',
      description: 'Cliente interesado en departamento de 2 ambientes en Palermo.',
      date: '2024-01-15T10:00:00Z',
      priority: 'high',
      agent_id: '1',
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      transaction_id: '1',
      type: 'documentation',
      title: 'Documentación del vendedor completa',
      description: 'Se recibió escritura, DNI, CUIL y certificado de dominio.',
      date: '2024-01-18T14:30:00Z',
      priority: 'medium',
      agent_id: '1',
      created_at: '2024-01-18T14:30:00Z',
    },
    {
      id: '3',
      transaction_id: '1',
      type: 'published',
      title: 'Propiedad publicada en portales',
      description: 'Publicado en ZonaProp, Mercado Libre y Argenprop.',
      date: '2024-01-20T09:00:00Z',
      priority: 'medium',
      agent_id: '1',
      created_at: '2024-01-20T09:00:00Z',
    },
    {
      id: '4',
      transaction_id: '1',
      type: 'visits',
      title: '5 visitas agendadas esta semana',
      description: 'Interesados calificados con presupuesto confirmado.',
      date: '2024-01-22T16:00:00Z',
      priority: 'high',
      agent_id: '1',
      created_at: '2024-01-22T16:00:00Z',
    },
  ];

  const stats = [
    {
      title: 'Propiedades Activas',
      value: '24',
      change: '+3 este mes',
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Clientes en Pipeline',
      value: '18',
      change: '+5 este mes',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Ventas Cerradas',
      value: '6',
      change: '+2 este mes',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Documentación Pendiente',
      value: '12',
      change: '-4 esta semana',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
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
      image: '/api/placeholder/150/100',
    },
    {
      id: '2',
      title: 'Casa 3 ambientes - Belgrano',
      price: '$280,000',
      status: 'reserved',
      visits: 15,
      interested: 7,
      image: '/api/placeholder/150/100',
    },
    {
      id: '3',
      title: 'Studio - Recoleta',
      price: '$85,000',
      status: 'available',
      visits: 5,
      interested: 2,
      image: '/api/placeholder/150/100',
    },
    {
      id: '4',
      title: 'PH 2 ambientes - Caballito',
      price: '$95,000',
      status: 'negotiation',
      visits: 12,
      interested: 4,
      image: '/api/placeholder/150/100',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-100 text-yellow-800">Reservado</Badge>;
      case 'negotiation':
        return <Badge className="bg-blue-100 text-blue-800">En Negociación</Badge>;
      case 'sold':
        return <Badge className="bg-red-100 text-red-800">Vendido</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Importar Propiedades
        </Button>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Generar Documento
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Reporte
        </Button>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avanzados
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Timeline de Procesos</CardTitle>
                  <CardDescription>
                    Actividad reciente de operaciones inmobiliarias
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Timeline 
                events={mockTimelineEvents}
                currentStep="visits"
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Properties & Quick Stats */}
        <div className="space-y-6">
          {/* Recent Properties */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Propiedades Recientes</CardTitle>
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {property.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {property.price}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {property.visits} visitas
                        </span>
                        <span className="text-xs text-gray-500">
                          {property.interested} interesados
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(property.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasa Conversión</span>
                  <span className="font-semibold">23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tiempo Promedio Venta</span>
                  <span className="font-semibold">45 días</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Visitas esta Semana</span>
                  <span className="font-semibold">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Propiedades Nuevas</span>
                  <span className="font-semibold">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
