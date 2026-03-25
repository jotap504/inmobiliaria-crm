'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  Calendar,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Navigation from '@/components/navigation';

const mockProperties = [
  {
    id: '1',
    title: 'Departamento 2 ambientes - Palermo',
    description: 'Excelente departamento en zona premium, muy luminoso y con balcon al parque.',
    address: 'Av. Scalabrini Ortiz 1234, Piso 5',
    city: 'Capital Federal',
    province: 'CABA',
    price: 120000,
    currency: 'USD',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    surface: 45,
    status: 'available',
    assigned_agents: ['1', '2'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    images: ['https://via.placeholder.com/400x300'],
    features: ['balcon', 'laundry', 'parking'],
    owner: {
      name: 'Juan Pérez',
      phone: '+54 11 5555-1234',
      email: 'juan.perez@email.com'
    }
  },
  {
    id: '2',
    title: 'Casa 3 ambientes - Belgrano',
    description: 'Amplia casa con jardín, ideal para familias. A estrenar.',
    address: 'Juramento 2345',
    city: 'Capital Federal',
    province: 'CABA',
    price: 250000,
    currency: 'USD',
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    surface: 120,
    status: 'reserved',
    assigned_agents: ['1'],
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-18T16:45:00Z',
    images: ['https://via.placeholder.com/400x300'],
    features: ['garden', 'garage', 'pool'],
    owner: {
      name: 'María González',
      phone: '+54 11 5555-5678',
      email: 'maria.gonzalez@email.com'
    }
  },
  {
    id: '3',
    title: 'Local Comercial - Microcentro',
    description: 'Local comercial en zona de alto tránsito, perfecto para negocios.',
    address: 'Florida 500',
    city: 'Capital Federal',
    province: 'CABA',
    price: 180000,
    currency: 'USD',
    type: 'commercial',
    bedrooms: 0,
    bathrooms: 1,
    surface: 80,
    status: 'negotiation',
    assigned_agents: ['3'],
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-22T10:15:00Z',
    images: ['https://via.placeholder.com/400x300'],
    features: ['display', 'storage', 'accessible'],
    owner: {
      name: 'Roberto Silva',
      phone: '+54 11 5555-9012',
      email: 'roberto.silva@email.com'
    }
  }
];

const mockAgents = [
  { id: '1', name: 'María García' },
  { id: '2', name: 'Carlos López' },
  { id: '3', name: 'Ana Martínez' }
];

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-50 text-green-700 text-xs px-2 py-0.5">Disponible</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5">Reservado</Badge>;
      case 'negotiation':
        return <Badge className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5">En Negociación</Badge>;
      case 'sold':
        return <Badge className="bg-red-50 text-red-700 text-xs px-2 py-0.5">Vendido</Badge>;
      default:
        return <Badge variant="outline" className="text-xs px-2 py-0.5">Desconocido</Badge>;
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'apartment': return 'Departamento';
      case 'house': return 'Casa';
      case 'land': return 'Terreno';
      case 'commercial': return 'Local Comercial';
      default: return type;
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePropertyClick = (propertyId: string) => {
    setSelectedProperty(propertyId);
    router.push(`/properties/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
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
                placeholder="Buscar propiedades..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="sm" className="h-9 px-3 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Nueva Propiedad
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{properties.length}</h3>
                  <p className="text-xs text-gray-500">Total Propiedades</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Home className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {properties.filter(p => p.status === 'available').length}
                  </h3>
                  <p className="text-xs text-gray-500">Disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Home className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {properties.filter(p => p.status === 'negotiation').length}
                  </h3>
                  <p className="text-xs text-gray-500">En Negociación</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Home className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ${properties.reduce((sum, p) => sum + p.price, 0).toLocaleString('es-AR')}
                  </h3>
                  <p className="text-xs text-gray-500">Valor Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Lista de Propiedades</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredProperties.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Home className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-1">No se encontraron propiedades</h3>
                <p className="text-sm text-gray-500">No hay propiedades que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <div 
                  key={property.id} 
                  className="px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Home className="h-8 w-8 text-gray-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900">{property.title}</h3>
                          {getStatusBadge(property.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                          <span>{property.address}</span>
                          <span>{property.city}</span>
                          <span>{getPropertyTypeLabel(property.type)}</span>
                          <span>{property.bedrooms} amb</span>
                          <span>{property.surface}m²</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <div className="flex -space-x-1">
                              {property.assigned_agents.slice(0, 2).map((agentId) => {
                                const agent = mockAgents.find(a => a.id === agentId);
                                return (
                                  <div
                                    key={agentId}
                                    className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center border border-white"
                                  >
                                    <span className="text-xs font-medium text-blue-600">
                                      {agent?.name.charAt(0)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </span>
                          <div className="text-xs text-gray-500 ml-2">
                            {property.assigned_agents.map(agentId => {
                              const agent = mockAgents.find(a => a.id === agentId);
                              return agent?.name;
                            }).join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-blue-600">
                          ${property.price.toLocaleString('es-AR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {property.currency}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePropertyClick(property.id)}
                        className="h-8 px-3 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalle
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Edit property:', property.id)}
                        className="h-8 px-3 text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Delete property:', property.id)}
                        className="h-8 px-3 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
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
