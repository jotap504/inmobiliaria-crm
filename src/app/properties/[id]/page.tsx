'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Plus,
  FileText,
  MessageSquare,
  Home,
  CheckCircle,
  Eye
} from 'lucide-react';
import Navigation from '@/components/navigation';

// Mock data - en producción vendría de Supabase
const mockProperty = {
  id: '1',
  title: 'Departamento 2 ambientes - Palermo',
  description: 'Excelente departamento en zona premium, muy luminoso y con balcon al parque. Recién remodelado con pisos de madera y cocina integral.',
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
};

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

const mockTransactions = [
  {
    id: '1',
    property_id: '1',
    client_id: 'client1',
    agent_id: 'agent1',
    status: 'negotiation',
    sale_price: 115000,
    commission_percentage: 3,
    estimated_closing_date: '2024-03-15',
    timeline_events: [
      {
        id: '1',
        transaction_id: '1',
        type: 'contact',
        title: 'Contacto inicial con cliente',
        description: 'Cliente interesado en departamento de 2 ambientes en Palermo. Presupuesto: $120,000 USD.',
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
    ],
    documents: [],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-22T16:00:00Z',
  },
];

const mockTimelineEvents = mockTransactions[0].timeline_events;

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(mockProperty);
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'agents'>('timeline');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const handleStageClick = (stageId: string) => {
    setSelectedStage(stageId);
    // Aquí podrías abrir un modal o navegar a la página específica de la etapa
    console.log('Stage clicked:', stageId);
  };

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

  // Timeline stages con sus eventos
  const timelineStages = [
    {
      id: 'contact',
      label: 'Contacto',
      description: 'Primer contacto con el cliente',
      events: mockTimelineEvents.filter(e => e.type === 'contact'),
      completed: true,
      current: false
    },
    {
      id: 'documentation',
      label: 'Documentación',
      description: 'Reunión de documentos del vendedor',
      events: mockTimelineEvents.filter(e => e.type === 'documentation'),
      completed: true,
      current: false
    },
    {
      id: 'published',
      label: 'Publicado',
      description: 'Propiedad publicada en portales',
      events: mockTimelineEvents.filter(e => e.type === 'published'),
      completed: true,
      current: false
    },
    {
      id: 'visits',
      label: 'Visitas',
      description: 'Agendamiento de visitas',
      events: mockTimelineEvents.filter(e => e.type === 'visits'),
      completed: true,
      current: true
    },
    {
      id: 'offer',
      label: 'Oferta',
      description: 'Recepción de ofertas',
      events: [],
      completed: false,
      current: false
    },
    {
      id: 'negotiation',
      label: 'Negociación',
      description: 'Negociación del precio y condiciones',
      events: [],
      completed: false,
      current: false
    },
    {
      id: 'boleto',
      label: 'Boleto',
      description: 'Firma de boleto de compraventa',
      events: [],
      completed: false,
      current: false
    },
    {
      id: 'writing',
      label: 'Escrituración',
      description: 'Transferencia de dominio',
      events: [],
      completed: false,
      current: false
    },
    {
      id: 'completed',
      label: 'Finalizado',
      description: 'Operación completada',
      events: [],
      completed: false,
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="flex items-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Regresar al Dashboard
          </Button>
        </div>
        
        {/* Property Summary */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{property.title}</h2>
                  <p className="text-sm text-gray-600">{property.address}</p>
                  <p className="text-lg font-bold text-blue-600">
                    ${property.price.toLocaleString('es-AR')} {property.currency}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <span className="font-medium ml-1">{getPropertyTypeLabel(property.property_type)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Dormitorios:</span>
                  <span className="font-medium ml-1">{property.bedrooms}</span>
                </div>
                <div>
                  <span className="text-gray-500">Baños:</span>
                  <span className="font-medium ml-1">{property.bathrooms}</span>
                </div>
                <div>
                  <span className="text-gray-500">Superficie:</span>
                  <span className="font-medium ml-1">{property.surface_total}m²</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-xs font-medium text-gray-600 mb-1">Estado del Proceso</h3>
                <div className="text-2xl font-bold text-blue-600">4/9</div>
                <p className="text-xs text-gray-500">Etapas completadas</p>
              </div>
              <div className="text-center">
                <h3 className="text-xs font-medium text-gray-600 mb-1">Tiempo Activo</h3>
                <div className="text-xl font-bold text-green-600">38d</div>
                <p className="text-xs text-gray-500">Días en mercado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
              className={`py-2 px-1 border-b-2 text-xs font-medium transition-colors ${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </button>
            <button
              className={`py-2 px-1 border-b-2 text-xs font-medium transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Detalles
            </button>
            <button
              className={`py-2 px-1 border-b-2 text-xs font-medium transition-colors ${
                activeTab === 'agents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('agents')}
            >
              Agentes
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'timeline' && (
            <div>
              {/* Interactive Timeline Stages */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
                <h3 className="text-base font-semibold mb-4">Progreso del Proceso</h3>
                <div className="relative">
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-6">
                    {timelineStages.map((stage, index) => (
                      <div 
                        key={stage.id} 
                        className="relative flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                        onClick={() => handleStageClick(stage.id)}
                      >
                        <div 
                          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            stage.current 
                              ? 'bg-blue-600 text-white ring-3 ring-blue-100' 
                              : stage.completed 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-xs font-medium">{index + 1}</div>
                            {stage.completed && (
                              <CheckCircle className="h-3 w-3 mt-0.5" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">{stage.label}</h4>
                              <p className="text-xs text-gray-600">{stage.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {stage.events.length > 0 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                  {stage.events.length} evento{stage.events.length > 1 ? 's' : ''}
                                </Badge>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Add event to stage:', stage.id);
                                }}
                                className="h-7 px-2 text-xs"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {stage.events.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {stage.events.map((event) => (
                                <div 
                                  key={event.id} 
                                  className="bg-gray-50 p-2 rounded-lg border border-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Event clicked:', event);
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h5 className="font-medium text-xs">{event.title}</h5>
                                      <p className="text-xs text-gray-600 mt-0.5">{event.description}</p>
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {new Date(event.date).toLocaleDateString('es-AR')}
                                      </p>
                                    </div>
                                    <Badge 
                                      className={`text-xs px-2 py-0.5 ${
                                        event.priority === 'high' 
                                          ? 'bg-red-50 text-red-700' 
                                          : event.priority === 'medium'
                                            ? 'bg-yellow-50 text-yellow-700'
                                            : 'bg-green-50 text-green-700'
                                      }`}
                                    >
                                      {event.priority === 'high' ? 'Alta' : event.priority === 'medium' ? 'Media' : 'Baja'}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Stage Detail */}
              {selectedStage && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">
                      Detalle: {timelineStages.find(s => s.id === selectedStage)?.label}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedStage(null)}
                      className="h-8 px-3 text-xs"
                    >
                      Cerrar
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2 text-sm">Acciones disponibles</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="h-8 px-3 text-xs">
                          <Plus className="h-3 w-3 mr-1" />
                          Agregar Evento
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          <Edit className="h-3 w-3 mr-1" />
                          Modificar Etapa
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Documentos
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          Agendar Tarea
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Información de la etapa</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Estado:</span>
                          <span className="font-medium ml-1">
                            {timelineStages.find(s => s.id === selectedStage)?.completed ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Eventos:</span>
                          <span className="font-medium ml-1">
                            {timelineStages.find(s => s.id === selectedStage)?.events.length || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Última actualización:</span>
                          <span className="font-medium ml-1">
                            {timelineStages.find(s => s.id === selectedStage)?.events[0]?.date 
                              ? new Date(timelineStages.find(s => s.id === selectedStage)!.events[0].date).toLocaleDateString('es-AR')
                              : 'Sin eventos'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Próxima acción:</span>
                          <span className="font-medium ml-1 text-blue-600">
                            {selectedStage === 'visits' ? 'Agendar visitas' : 
                             selectedStage === 'documentation' ? 'Revisar documentos' :
                             selectedStage === 'published' ? 'Monitorear portales' :
                             'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-base font-semibold mb-4">Detalles de Propiedad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Dirección</label>
                    <p className="text-sm text-gray-900">{property.address}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Ciudad</label>
                    <p className="text-sm text-gray-900">{property.city}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Provincia</label>
                    <p className="text-sm text-gray-900">{property.province}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Tipo</label>
                    <p className="text-sm text-gray-900">{getPropertyTypeLabel(property.property_type)}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Precio</label>
                    <p className="text-lg font-bold text-blue-600">
                      ${property.price.toLocaleString('es-AR')} {property.currency}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Dormitorios</label>
                    <p className="text-sm text-gray-900">{property.bedrooms}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Baños</label>
                    <p className="text-sm text-gray-900">{property.bathrooms}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Superficie Total</label>
                    <p className="text-sm text-gray-900">{property.surface_total}m²</p>
                  </div>
                  {property.expenses && (
                    <div>
                      <label className="text-xs font-medium text-gray-700">Expensas</label>
                      <p className="text-sm text-gray-900">${property.expenses.toLocaleString('es-AR')}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {property.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="text-xs font-medium text-gray-700">Descripción</label>
                  <p className="text-sm text-gray-900 mt-1">{property.description}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold">Agentes Asignados</h3>
                <Button size="sm" className="h-8 px-3 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Asignar Agente
                </Button>
              </div>
              <div className="space-y-3">
                {property.assigned_agents.map((agentId) => {
                  const agent = mockAgents.find(a => a.id === agentId);
                  return (
                    <div key={agentId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {agent?.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{agent?.name}</h4>
                          <p className="text-xs text-gray-600">{agent?.email}</p>
                          <p className="text-xs text-gray-600">{agent?.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {agent?.commission}% comisión
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                {property.assigned_agents.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay agentes asignados a esta propiedad</p>
                    <Button className="mt-3 h-8 px-3 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Asignar Primer Agente
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
