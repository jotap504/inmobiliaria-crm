'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timeline } from '@/components/ui/timeline';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Plus, 
  Calendar,
  FileText,
  Upload,
  Download,
  User,
  Home,
  CheckCircle
} from 'lucide-react';

// Mock data - en producción vendría de Supabase
const mockTransaction = {
  id: '1',
  property_id: '1',
  client_id: 'client1',
  agent_id: 'agent1',
  status: 'negotiation',
  sale_price: 115000,
  commission_percentage: 3,
  estimated_closing_date: '2024-03-15',
  actual_closing_date: null,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-22T16:00:00Z',
};

const mockProperty = {
  id: '1',
  title: 'Departamento 2 ambientes - Palermo',
  address: 'Av. Scalabrini Ortiz 1234, Piso 5',
  city: 'Capital Federal',
  province: 'CABA',
  price: 120000,
  currency: 'USD',
  property_type: 'apartment',
};

const mockClient = {
  id: 'client1',
  name: 'Juan Pérez',
  email: 'juan.perez@email.com',
  phone: '+54 11 5555-1234',
  dni: '30.123.456',
  cuil: '20-30123456-7',
  type: 'buyer',
};

const mockAgent = {
  id: 'agent1',
  name: 'María García',
  email: 'maria@inmobiliaria.com',
  phone: '+54 11 5555-1234',
  commission: 3,
};

const mockTimelineEvents = [
  {
    id: '1',
    transaction_id: '1',
    type: 'contact',
    title: 'Contacto inicial con cliente',
    description: 'Cliente interesado en departamento de 2 ambientes en Palermo. Presupuesto: $150,000 USD.',
    date: '2024-01-15T10:00:00Z',
    priority: 'high',
    agent_id: 'agent1',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    transaction_id: '1',
    type: 'documentation',
    title: 'Documentación del vendedor completa',
    description: 'Se recibió escritura, DNI, CUIL y certificado de dominio. Todo en orden.',
    date: '2024-01-18T14:30:00Z',
    priority: 'medium',
    agent_id: 'agent1',
    created_at: '2024-01-18T14:30:00Z',
  },
  {
    id: '3',
    transaction_id: '1',
    type: 'published',
    title: 'Propiedad publicada en portales',
    description: 'Publicado en ZonaProp, Mercado Libre y Argenprop. 25 visitas en la primera semana.',
    date: '2024-01-20T09:00:00Z',
    priority: 'medium',
    agent_id: 'agent1',
    created_at: '2024-01-20T09:00:00Z',
  },
  {
    id: '4',
    transaction_id: '1',
    type: 'visits',
    title: '5 visitas agendadas esta semana',
    description: 'Interesados calificados con presupuesto confirmado. 2 muy interesados.',
    date: '2024-01-22T16:00:00Z',
    priority: 'high',
    agent_id: 'agent1',
    created_at: '2024-01-22T16:00:00Z',
  },
  {
    id: '5',
    transaction_id: '1',
    type: 'negotiation',
    title: 'En negociación con 2 interesados',
    description: 'Ambos clientes tienen aprobación crediticia. Ofertas recibidas: $110,000 y $115,000.',
    date: '2024-01-25T11:00:00Z',
    priority: 'high',
    agent_id: 'agent1',
    created_at: '2024-01-25T11:00:00Z',
  },
];

const mockDocuments = [
  {
    id: '1',
    name: 'DNI Vendedor',
    type: 'identity',
    status: 'approved',
    upload_date: '2024-01-18T10:00:00Z',
    file_url: '/documents/dni_vendedor.pdf',
  },
  {
    id: '2',
    name: 'Escritura Propiedad',
    type: 'deed',
    status: 'approved',
    upload_date: '2024-01-18T10:30:00Z',
    file_url: '/documents/escritura.pdf',
  },
  {
    id: '3',
    name: 'Certificado de Dominio',
    type: 'certificate',
    status: 'pending',
    upload_date: '2024-01-19T14:00:00Z',
    file_url: '/documents/certificado_dominio.pdf',
  },
  {
    id: '4',
    name: 'CIBA Vendedor',
    type: 'tax_certificate',
    status: 'missing',
    upload_date: null,
    file_url: null,
  },
];

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState(mockTransaction);
  const [activeTab, setActiveTab] = useState<'timeline' | 'documents' | 'details'>('timeline');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'contact':
        return <Badge className="bg-blue-100 text-blue-800">Contacto</Badge>;
      case 'documentation':
        return <Badge className="bg-yellow-100 text-yellow-800">Documentación</Badge>;
      case 'published':
        return <Badge className="bg-purple-100 text-purple-800">Publicado</Badge>;
      case 'visits':
        return <Badge className="bg-green-100 text-green-800">Visitas</Badge>;
      case 'negotiation':
        return <Badge className="bg-orange-100 text-orange-800">Negociación</Badge>;
      case 'boleto':
        return <Badge className="bg-pink-100 text-pink-800">Boleto</Badge>;
      case 'writing':
        return <Badge className="bg-indigo-100 text-indigo-800">Escrituración</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800">Completada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      case 'missing':
        return <Badge className="bg-gray-100 text-gray-800">Faltante</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getCurrentStep = () => {
    if (!mockTimelineEvents || mockTimelineEvents.length === 0) return 'contact';
    const latestEvent = mockTimelineEvents[mockTimelineEvents.length - 1];
    return latestEvent.type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/properties')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 ml-4">
                Proceso #{transaction.id}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generar Documento
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Propiedad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{mockProperty.title}</span>
                </div>
                <p className="text-sm text-gray-600">{mockProperty.address}</p>
                <p className="text-lg font-bold text-blue-600">
                  ${mockProperty.price.toLocaleString('es-AR')} {mockProperty.currency}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{mockClient.name}</span>
                </div>
                <p className="text-sm text-gray-600">{mockClient.email}</p>
                <p className="text-sm text-gray-600">{mockClient.phone}</p>
                <p className="text-sm text-gray-600">DNI: {mockClient.dni}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Agente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{mockAgent.name}</span>
                </div>
                <p className="text-sm text-gray-600">{mockAgent.email}</p>
                <p className="text-sm text-gray-600">{mockAgent.phone}</p>
                <p className="text-sm text-gray-600">Comisión: {mockAgent.commission}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline del Proceso
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Documentación
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Detalles de Transacción
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'timeline' && (
            <Card>
              <CardHeader>
                <CardTitle>Timeline del Proceso</CardTitle>
                <CardDescription>
                  Seguimiento completo de la transacción
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline 
                  events={mockTimelineEvents}
                  currentStep={getCurrentStep()}
                />
              </CardContent>
            </Card>
          )}

          {activeTab === 'documents' && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Documentación Requerida</CardTitle>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Documento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-600">
                          Tipo: {doc.type}
                        </p>
                        {doc.upload_date && (
                          <p className="text-xs text-gray-500">
                            Subido: {new Date(doc.upload_date).toLocaleDateString('es-AR')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getDocumentStatusBadge(doc.status)}
                        {doc.file_url && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Transacción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Estado del Proceso</label>
                      <div className="mt-1">
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Precio de Venta</label>
                      <p className="text-lg font-semibold">
                        ${transaction.sale_price?.toLocaleString('es-AR') || 'No definido'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Comisión del Agente</label>
                      <p className="text-lg font-semibold">
                        {transaction.commission_percentage}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fecha de Creación</label>
                      <p className="text-gray-900">
                        {new Date(transaction.created_at).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fecha Estimada de Cierre</label>
                      <p className="text-gray-900">
                        {transaction.estimated_closing_date 
                          ? new Date(transaction.estimated_closing_date).toLocaleDateString('es-AR')
                          : 'No definida'
                        }
                      </p>
                    </div>
                    {transaction.actual_closing_date && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Fecha Real de Cierre</label>
                        <p className="text-gray-900">
                          {new Date(transaction.actual_closing_date).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
