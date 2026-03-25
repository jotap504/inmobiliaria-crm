// Core Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'broker' | 'agent';
  broker_id?: string;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  province: string;
  price: number;
  currency: 'ARS' | 'USD';
  property_type: 'house' | 'apartment' | 'land' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  surface_total: number;
  surface_covered?: number;
  expenses?: number;
  status: 'available' | 'reserved' | 'sold' | 'rented';
  agent_id: string;
  broker_id: string;
  images: string[];
  documents: Document[];
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  dni: string;
  cuil: string;
  type: 'seller' | 'buyer' | 'both';
  properties_owned?: string[];
  properties_interested?: string[];
  agent_id: string;
  broker_id: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  property_id: string;
  seller_id: string;
  buyer_id: string;
  agent_id: string;
  broker_id: string;
  status: 'contact' | 'documentation' | 'published' | 'visits' | 'negotiation' | 'boleto' | 'writing' | 'completed';
  sale_price?: number;
  commission_percentage?: number;
  estimated_closing_date?: string;
  actual_closing_date?: string;
  timeline_events: TimelineEvent[];
  documents: Document[];
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  transaction_id: string;
  type: 'contact' | 'documentation' | 'visit' | 'offer' | 'negotiation' | 'boleto' | 'writing' | 'completed';
  title: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  agent_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'dni' | 'cuil' | 'writing' | 'boleto' | 'domain_report' | 'inhibition_report' | 'tax_certificate' | 'other';
  file_url: string;
  file_type: string;
  file_size: number;
  entity_type: 'property' | 'client' | 'transaction';
  entity_id: string;
  uploaded_by: string;
  created_at: string;
}

// Tax Calculator Types
export interface TaxConfig {
  id: string;
  nombre: string;
  porcentaje: number;
  base_calculo: 'precio_venta' | 'precio_venta_menos_costos';
  aplica: boolean;
  condicion?: string;
  provincia?: string;
  monto_fijo?: number;
  tipo: 'porcentaje' | 'fijo' | 'escalable';
}

export interface TaxCalculation {
  property_id: string;
  precio_venta: number;
  impuestos: TaxItem[];
  total_impuestos: number;
  costo_total: number;
  created_at: string;
}

export interface TaxItem {
  nombre: string;
  monto: number;
  porcentaje?: number;
  base_calculo: number;
}

// Report Types
export interface ReportConfig {
  id: string;
  tipo: 'mensual' | 'trimestral' | 'anual' | 'personalizado';
  destinatarios: string[];
  secciones: {
    ventas_cerradas: boolean;
    propiedades_disponibles: boolean;
    pipeline_ventas: boolean;
    metricas_agentes: boolean;
    estado_documentacion: boolean;
  };
  formato: 'pdf' | 'excel' | 'ambos';
  broker_id: string;
  activo: boolean;
}

// Import Types
export interface ImportConfig {
  id: string;
  fuente: 'excel' | 'api_zonaprop' | 'api_mercadolibre' | 'custom_api';
  mapeo_campos: Record<string, string>;
  actualizacion_automatica: boolean;
  frecuencia_actualizacion: 'diaria' | 'semanal' | 'mensual';
  ultima_actualizacion?: string;
  broker_id: string;
  api_config?: {
    url?: string;
    headers?: Record<string, string>;
    auth_type?: 'bearer' | 'basic' | 'api_key';
  };
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  action_url?: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pages: number;
}
