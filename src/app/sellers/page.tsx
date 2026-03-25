'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

const mockSellers = [
  {
    id: '1',
    name: 'María García',
    email: 'maria.garcia@inmobiliaria.com',
    phone: '+54 11 5555-1234',
    commission: 3,
    properties_sold: 12,
    properties_active: 5,
    total_sales: 2500000,
    rating: 4.8,
    status: 'active',
    join_date: '2023-01-15T10:00:00Z',
    last_sale: '2024-01-20T14:30:00Z',
    address: 'Av. Corrientes 1234, CABA',
    specialization: ['apartment', 'house'],
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos.lopez@inmobiliaria.com',
    phone: '+54 11 5555-5678',
    commission: 3,
    properties_sold: 8,
    properties_active: 3,
    total_sales: 1800000,
    rating: 4.6,
    status: 'active',
    join_date: '2023-03-10T09:00:00Z',
    last_sale: '2024-01-18T16:45:00Z',
    address: 'Av. Santa Fe 567, CABA',
    specialization: ['apartment', 'commercial'],
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@inmobiliaria.com',
    phone: '+54 11 5555-9012',
    commission: 2.5,
    properties_sold: 15,
    properties_active: 7,
    total_sales: 3200000,
    rating: 4.9,
    status: 'active',
    join_date: '2022-11-20T11:00:00Z',
    last_sale: '2024-01-22T10:15:00Z',
    address: 'Av. Córdoba 890, CABA',
    specialization: ['house', 'land'],
  },
  {
    id: '4',
    name: 'Roberto Silva',
    email: 'roberto.silva@inmobiliaria.com',
    phone: '+54 11 5555-3456',
    commission: 4,
    properties_sold: 6,
    properties_active: 2,
    total_sales: 1500000,
    rating: 4.3,
    status: 'inactive',
    join_date: '2023-06-05T13:30:00Z',
    last_sale: '2023-12-10T12:00:00Z',
    address: 'Av. Belgrano 234, CABA',
    specialization: ['commercial'],
  },
];

export default function SellersPage() {
  const [sellers, setSellers] = useState(mockSellers);
  const [searchTerm, setSearchTerm] = useState('');

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

  const getSpecializationLabel = (specs: string[]) => {
    const labels: { [key: string]: string } = {
      'apartment': 'Departamentos',
      'house': 'Casas',
      'land': 'Terrenos',
      'commercial': 'Comerciales'
    };
    return specs.map(spec => labels[spec] || spec).join(', ');
  };

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">Vendedores</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar vendedores..."
                  className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 px-3 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                Filtros
              </Button>
              <Button size="sm" className="h-9 px-3 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Nuevo Vendedor
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{sellers.length}</h3>
                    <p className="text-xs text-gray-500">Total Vendedores</p>
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
                      {sellers.filter(s => s.status === 'active').length}
                    </h3>
                    <p className="text-xs text-gray-500">Activos</p>
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
                      ${sellers.reduce((sum, s) => sum + s.total_sales, 0).toLocaleString('es-AR')}
                    </h3>
                    <p className="text-xs text-gray-500">Ventas Totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {(sellers.reduce((sum, s) => sum + s.rating, 0) / sellers.length).toFixed(1)}
                    </h3>
                    <p className="text-xs text-gray-500">Rating Promedio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Lista de Vendedores</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredSellers.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-1">No se encontraron vendedores</h3>
                <p className="text-sm text-gray-500">No hay vendedores que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              filteredSellers.map((seller) => (
                <div 
                  key={seller.id} 
                  className="px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-medium text-blue-600">
                          {seller.name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900">{seller.name}</h3>
                          {getStatusBadge(seller.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {seller.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {seller.phone}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {seller.address}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Especialización: {getSpecializationLabel(seller.specialization)}</span>
                          <span>Comisión: {seller.commission}%</span>
                          <span>Rating: ⭐ {seller.rating}</span>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-blue-600">
                          ${seller.total_sales.toLocaleString('es-AR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {seller.properties_sold} vendidas
                        </div>
                        <div className="text-xs text-gray-500">
                          {seller.properties_active} activas
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('View seller:', seller.id)}
                        className="h-8 px-3 text-xs"
                      >
                        Ver Detalle
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Edit seller:', seller.id)}
                        className="h-8 px-3 text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Delete seller:', seller.id)}
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
