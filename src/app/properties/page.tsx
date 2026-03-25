'use client';

import { useState } from 'react';
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
import { useRouter } from 'next/navigation';

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
    property_type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    surface_total: 65,
    surface_covered: 60,
    expenses: 8500,
    status: 'available',
    images: [],
    assigned_agents: ['agent1', 'agent2'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Casa 3 ambientes - Belgrano',
    description: 'Hermosa casa con jardín, piscina y quincho. Ideal para familias.',
    address: 'Juramento 2345',
    city: 'Capital Federal',
    province: 'CABA',
    price: 250000,
    currency: 'USD',
    property_type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    surface_total: 180,
    surface_covered: 150,
    expenses: 15000,
    status: 'negotiation',
    images: [],
    assigned_agents: ['agent2'],
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-20T09:15:00Z',
  },
  {
    id: '3',
    title: 'Local Comercial - Microcentro',
    description: 'Local en zona de alto tránsito, perfecto para negocios.',
    address: 'Florida 567',
    city: 'Capital Federal',
    province: 'CABA',
    price: 180000,
    currency: 'USD',
    property_type: 'commercial',
    bedrooms: 0,
    bathrooms: 1,
    surface_total: 85,
    surface_covered: 80,
    expenses: 12000,
    status: 'available',
    images: [],
    assigned_agents: ['agent1'],
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-18T16:45:00Z',
  },
];

const mockAgents = [
  { 
    id: 'agent1', 
    name: 'María García', 
    email: 'maria@inmobiliaria.com',
    phone: '+54 11 5555-1234',
    commission: 3
  },
  { 
    id: 'agent2', 
    name: 'Carlos López', 
    email: 'carlos@inmobiliaria.com',
    phone: '+54 11 5555-5678',
    commission: 3
  },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const router = useRouter();

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
    property.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePropertyClick = (propertyId: string) => {
    setSelectedProperty(propertyId);
    router.push(`/properties/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
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
                      {properties.filter(p => p.status === 'sold').length}
                    </h3>
                    <p className="text-xs text-gray-500">Vendidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  className="px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Home className="h-7 w-7 text-gray-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{property.title}</h3>
                          {getStatusBadge(property.status)}
                        </div>
                        <p className="text-xs text-gray-500 mb-2 truncate">{property.address}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <span className="font-medium">{getPropertyTypeLabel(property.property_type)}</span>
                          </span>
                          <span>{property.bedrooms} dorm</span>
                          <span>{property.bathrooms} baños</span>
                          <span>{property.surface_total}m²</span>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-blue-600">
                          ${property.price.toLocaleString('es-AR')} {property.currency}
                        </div>
                        {property.expenses && (
                          <div className="text-xs text-gray-500">
                            Exp: ${property.expenses.toLocaleString('es-AR')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="flex -space-x-1">
                          {property.assigned_agents.slice(0, 2).map((agentId) => {
                            const agent = mockAgents.find(a => a.id === agentId);
                            return (
                              <div
                                key={agentId}
                                className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center border border-white"
                                title={agent?.name}
                              >
                                <span className="text-xs font-medium text-blue-600">
                                  {agent?.name.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                            );
                          })}
                          {property.assigned_agents.length > 2 && (
                            <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center border border-white">
                              <span className="text-xs font-medium text-gray-600">
                                +{property.assigned_agents.length - 2}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 ml-2">
                          {property.assigned_agents.map(agentId => {
                            const agent = mockAgents.find(a => a.id === agentId);
                            return agent?.name;
                          }).join(', ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropertyClick(property.id);
                        }}
                        className="h-8 px-3 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit property:', property.id);
                        }}
                        className="h-8 px-3 text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Delete property:', property.id);
                        }}
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
