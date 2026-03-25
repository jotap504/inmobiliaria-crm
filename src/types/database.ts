export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'broker' | 'agent';
          broker_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'broker' | 'agent';
          broker_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'broker' | 'agent';
          broker_id?: string;
          created_at?: string;
        };
      };
      properties: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
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
          status?: 'available' | 'reserved' | 'sold' | 'rented';
          agent_id: string;
          broker_id: string;
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          address?: string;
          city?: string;
          province?: string;
          price?: number;
          currency?: 'ARS' | 'USD';
          property_type?: 'house' | 'apartment' | 'land' | 'commercial';
          bedrooms?: number;
          bathrooms?: number;
          surface_total?: number;
          surface_covered?: number;
          expenses?: number;
          status?: 'available' | 'reserved' | 'sold' | 'rented';
          agent_id?: string;
          broker_id?: string;
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
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
        };
        Insert: {
          id?: string;
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
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          dni?: string;
          cuil?: string;
          type?: 'seller' | 'buyer' | 'both';
          properties_owned?: string[];
          properties_interested?: string[];
          agent_id?: string;
          broker_id?: string;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          seller_id: string;
          buyer_id: string;
          agent_id: string;
          broker_id: string;
          status?: 'contact' | 'documentation' | 'published' | 'visits' | 'negotiation' | 'boleto' | 'writing' | 'completed';
          sale_price?: number;
          commission_percentage?: number;
          estimated_closing_date?: string;
          actual_closing_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          seller_id?: string;
          buyer_id?: string;
          agent_id?: string;
          broker_id?: string;
          status?: 'contact' | 'documentation' | 'published' | 'visits' | 'negotiation' | 'boleto' | 'writing' | 'completed';
          sale_price?: number;
          commission_percentage?: number;
          estimated_closing_date?: string;
          actual_closing_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      timeline_events: {
        Row: {
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
        };
        Insert: {
          id?: string;
          transaction_id: string;
          type: 'contact' | 'documentation' | 'visit' | 'offer' | 'negotiation' | 'boleto' | 'writing' | 'completed';
          title: string;
          description: string;
          date: string;
          priority: 'low' | 'medium' | 'high';
          agent_id: string;
          metadata?: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          transaction_id?: string;
          type?: 'contact' | 'documentation' | 'visit' | 'offer' | 'negotiation' | 'boleto' | 'writing' | 'completed';
          title?: string;
          description?: string;
          date?: string;
          priority?: 'low' | 'medium' | 'high';
          agent_id?: string;
          metadata?: Record<string, any>;
          created_at?: string;
        };
      };
      documents: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          type: 'dni' | 'cuil' | 'writing' | 'boleto' | 'domain_report' | 'inhibition_report' | 'tax_certificate' | 'other';
          file_url: string;
          file_type: string;
          file_size: number;
          entity_type: 'property' | 'client' | 'transaction';
          entity_id: string;
          uploaded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'dni' | 'cuil' | 'writing' | 'boleto' | 'domain_report' | 'inhibition_report' | 'tax_certificate' | 'other';
          file_url?: string;
          file_type?: string;
          file_size?: number;
          entity_type?: 'property' | 'client' | 'transaction';
          entity_id?: string;
          uploaded_by?: string;
          created_at?: string;
        };
      };
    };
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
