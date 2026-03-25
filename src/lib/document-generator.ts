import { Client, Property, Transaction } from '@/types';
import jsPDF from 'jspdf';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'boleto' | 'contrato_servicio' | 'reserva' | 'escritura' | 'poder' | 'custom';
  description: string;
  requiredFields: string[];
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'select';
  required: boolean;
  options?: string[]; // Para tipo select
  defaultValue?: any;
}

export interface DocumentData {
  templateId: string;
  variables: Record<string, any>;
  client?: Client;
  property?: Property;
  transaction?: Transaction;
  customClauses?: string[];
}

export interface GeneratedDocument {
  id: string;
  name: string;
  type: string;
  content: string; // HTML o texto plano
  pdfUrl?: string;
  createdAt: string;
  status: 'draft' | 'generated' | 'signed';
}

export class DocumentGeneratorService {
  private openaiApiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not found in environment variables');
    }
  }

  /**
   * Plantillas de documentos predefinidas para Argentina
   */
  private getDocumentTemplates(): DocumentTemplate[] {
    return [
      {
        id: 'contrato_servicio_inmobiliario',
        name: 'Contrato de Servicio Inmobiliario',
        type: 'contrato_servicio',
        description: 'Contrato entre propietario y agente inmobiliario para comercialización',
        requiredFields: ['propietario', 'agente', 'propiedad', 'comision', 'plazo'],
        variables: [
          { name: 'propietario_nombre', label: 'Nombre del Propietario', type: 'text', required: true },
          { name: 'propietario_dni', label: 'DNI del Propietario', type: 'text', required: true },
          { name: 'propietario_domicilio', label: 'Domicilio del Propietario', type: 'text', required: true },
          { name: 'agente_nombre', label: 'Nombre del Agente', type: 'text', required: true },
          { name: 'agente_matricula', label: 'Matrícula del Agente', type: 'text', required: true },
          { name: 'inmobiliaria_nombre', label: 'Nombre de la Inmobiliaria', type: 'text', required: true },
          { name: 'propiedad_direccion', label: 'Dirección de la Propiedad', type: 'text', required: true },
          { name: 'propiedad_tipo', label: 'Tipo de Propiedad', type: 'select', required: true, options: ['Departamento', 'Casa', 'PH', 'Terreno', 'Local Comercial'] },
          { name: 'comision_porcentaje', label: 'Comisión (%)', type: 'number', required: true, defaultValue: 3 },
          { name: 'comision_forma_pago', label: 'Forma de Pago Comisión', type: 'select', required: true, options: ['Al firmar boleto', 'Al escriturar', '50% y 50%'] },
          { name: 'plazo_meses', label: 'Plazo de exclusividad (meses)', type: 'number', required: true, defaultValue: 6 },
          { name: 'precio_sugerido', label: 'Precio de Venta Sugerido', type: 'currency', required: true },
          { name: 'acepta_visitas', label: 'Acepta visitas sin aviso', type: 'boolean', required: true },
          { name: 'observaciones', label: 'Observaciones', type: 'text', required: false },
        ]
      },
      {
        id: 'boleto_compra_venta',
        name: 'Boleto de Compra Venta',
        type: 'boleto',
        description: 'Boleto de compra venta entre comprador y vendedor',
        requiredFields: ['comprador', 'vendedor', 'propiedad', 'precio', 'seña'],
        variables: [
          { name: 'comprador_nombre', label: 'Nombre del Comprador', type: 'text', required: true },
          { name: 'comprador_dni', label: 'DNI del Comprador', type: 'text', required: true },
          { name: 'comprador_domicilio', label: 'Domicilio del Comprador', type: 'text', required: true },
          { name: 'vendedor_nombre', label: 'Nombre del Vendedor', type: 'text', required: true },
          { name: 'vendedor_dni', label: 'DNI del Vendedor', type: 'text', required: true },
          { name: 'vendedor_domicilio', label: 'Domicilio del Vendedor', type: 'text', required: true },
          { name: 'propiedad_direccion', label: 'Dirección de la Propiedad', type: 'text', required: true },
          { name: 'propiedad_descripcion', label: 'Descripción de la Propiedad', type: 'text', required: true },
          { name: 'precio_total', label: 'Precio Total de Venta', type: 'currency', required: true },
          { name: 'seña_monto', label: 'Monto de la Seña', type: 'currency', required: true },
          { name: 'seña_porcentaje', label: 'Porcentaje de Seña', type: 'number', required: true },
          { name: 'saldo_fecha', label: 'Fecha de Pago del Saldo', type: 'date', required: true },
          { name: 'escritura_fecha_estimada', label: 'Fecha Estimada de Escrituración', type: 'date', required: true },
          { name: 'estado_propiedad', label: 'Estado de la Propiedad', type: 'select', required: true, options: ['Libre de gravamen', 'Con hipoteca', 'En condominio'] },
          { name: 'incluye_gastos_escritura', label: 'Incluye gastos de escrituración', type: 'boolean', required: true },
          { name: 'penalidad_incumplimiento', label: 'Penalidad por incumplimiento (%)', type: 'number', required: true, defaultValue: 10 },
        ]
      },
      {
        id: 'reserva_propiedad',
        name: 'Reserva de Propiedad',
        type: 'reserva',
        description: 'Acuerdo de reserva de propiedad',
        requiredFields: ['interesado', 'propiedad', 'monto_reserva', 'plazo'],
        variables: [
          { name: 'interesado_nombre', label: 'Nombre del Interesado', type: 'text', required: true },
          { name: 'interesado_dni', label: 'DNI del Interesado', type: 'text', required: true },
          { name: 'interesado_telefono', label: 'Teléfono del Interesado', type: 'text', required: true },
          { name: 'propietario_nombre', label: 'Nombre del Propietario', type: 'text', required: true },
          { name: 'propiedad_direccion', label: 'Dirección de la Propiedad', type: 'text', required: true },
          { name: 'monto_reserva', label: 'Monto de la Reserva', type: 'currency', required: true },
          { name: 'plazo_dias', label: 'Plazo de reserva (días)', type: 'number', required: true, defaultValue: 5 },
          { name: 'precio_venta', label: 'Precio de Venta', type: 'currency', required: true },
          { name: 'condiciones', label: 'Condiciones de la Reserva', type: 'text', required: false },
        ]
      }
    ];
  }

  /**
   * Obtiene todas las plantillas disponibles
   */
  getTemplates(): DocumentTemplate[] {
    return this.getDocumentTemplates();
  }

  /**
   * Obtiene una plantilla específica
   */
  getTemplate(id: string): DocumentTemplate | undefined {
    return this.getDocumentTemplates().find(template => template.id === id);
  }

  /**
   * Genera un documento usando IA
   */
  async generateDocument(data: DocumentData): Promise<GeneratedDocument> {
    try {
      const template = this.getTemplate(data.templateId);
      if (!template) {
        throw new Error('Plantilla no encontrada');
      }

      // Construir el prompt para la IA
      const prompt = this.buildPrompt(template, data);
      
      // Llamar a OpenAI API
      const content = await this.callOpenAI(prompt);
      
      // Generar PDF
      const pdfUrl = await this.generatePDF(content, template.name);
      
      const document: GeneratedDocument = {
        id: `doc_${Date.now()}`,
        name: `${template.name}_${new Date().toISOString().split('T')[0]}`,
        type: template.type,
        content,
        pdfUrl,
        createdAt: new Date().toISOString(),
        status: 'generated',
      };

      return document;
    } catch (error) {
      console.error('Error generating document:', error);
      throw error;
    }
  }

  /**
   * Construye el prompt para OpenAI
   */
  private buildPrompt(template: DocumentTemplate, data: DocumentData): string {
    const variablesText = Object.entries(data.variables)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const contextInfo = this.buildContextInfo(data);

    return `Actúa como un abogado especializado en derecho inmobiliario argentino. 

Genera un documento legal para "${template.name}" con el siguiente contexto:

INFORMACIÓN DEL DOCUMENTO:
${contextInfo}

VARIABLES ESPECÍFICAS:
${variablesText}

REQUISITOS:
- El documento debe cumplir con la legislación argentina vigente
- Incluir cláusulas de protección para ambas partes
- Usar lenguaje formal y técnico apropiado
- Incluir espacios para firmas
- Agregar fecha y lugar de firma
- Incluir cláusulas estándar del derecho inmobiliario argentino

${data.customClauses && data.customClauses.length > 0 ? `
CLÁUSULAS PERSONALIZADAS ADICIONALES:
${data.customClauses.join('\n')}
` : ''}

Genera el documento completo en formato profesional, listo para ser firmado digitalmente.`;
  }

  /**
   * Construye información de contexto del cliente, propiedad y transacción
   */
  private buildContextInfo(data: DocumentData): string {
    let context = '';

    if (data.client) {
      context += `DATOS DEL CLIENTE:
Nombre: ${data.client.name}
DNI: ${data.client.dni}
CUIT/CUIL: ${data.client.cuil}
Teléfono: ${data.client.phone}
Email: ${data.client.email}
Tipo: ${data.client.type}

`;
    }

    if (data.property) {
      context += `DATOS DE LA PROPIEDAD:
Título: ${data.property.title}
Dirección: ${data.property.address}
Ciudad: ${data.property.city}
Provincia: ${data.property.province}
Precio: ${data.property.currency} ${data.property.price}
Tipo: ${data.property.property_type}
Superficie Total: ${data.property.surface_total}m²
${data.property.bedrooms ? `Dormitorios: ${data.property.bedrooms}` : ''}
${data.property.bathrooms ? `Baños: ${data.property.bathrooms}` : ''}
${data.property.expenses ? `Expensas: ${data.property.currency} ${data.property.expenses}` : ''}

`;
    }

    if (data.transaction) {
      context += `DATOS DE LA TRANSACCIÓN:
Estado: ${data.transaction.status}
${data.transaction.sale_price ? `Precio de Venta: ${data.transaction.sale_price}` : ''}
${data.transaction.commission_percentage ? `Comisión: ${data.transaction.commission_percentage}%` : ''}
${data.transaction.estimated_closing_date ? `Fecha estimada de cierre: ${data.transaction.estimated_closing_date}` : ''}

`;
    }

    return context;
  }

  /**
   * Llama a la API de OpenAI
   */
  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en derecho inmobiliario argentino. Genera documentos legales precisos y completos.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Genera PDF a partir del contenido
   */
  private async generatePDF(content: string, title: string): Promise<string> {
    const pdf = new jsPDF();
    
    // Configurar fuente
    pdf.setFont('helvetica');
    pdf.setFontSize(12);
    
    // Agregar título
    pdf.setFontSize(16);
    pdf.text(title, 20, 20);
    
    // Agregar contenido
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(content, 170);
    pdf.text(lines, 20, 40);
    
    // Generar blob y URL
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return pdfUrl;
  }

  /**
   * Previsualiza un documento sin generarlo completamente
   */
  async previewDocument(data: DocumentData): Promise<string> {
    const template = this.getTemplate(data.templateId);
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    const prompt = this.buildPrompt(template, data);
    return await this.callOpenAI(prompt);
  }

  /**
   * Valida los datos antes de generar el documento
   */
  validateDocumentData(data: DocumentData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const template = this.getTemplate(data.templateId);

    if (!template) {
      errors.push('Plantilla no encontrada');
      return { isValid: false, errors };
    }

    // Validar campos requeridos de la plantilla
    template.variables.forEach(variable => {
      if (variable.required && !data.variables[variable.name]) {
        errors.push(`El campo "${variable.label}" es requerido`);
      }
    });

    // Validaciones específicas según tipo de documento
    if (template.type === 'boleto') {
      const precioTotal = parseFloat(data.variables.precio_total || '0');
      const señaMonto = parseFloat(data.variables.seña_monto || '0');
      
      if (señaMonto > precioTotal) {
        errors.push('El monto de la seña no puede ser mayor al precio total');
      }
      
      if (señaMonto < precioTotal * 0.1) {
        errors.push('La seña debe ser al menos el 10% del precio total');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Genera cláusulas personalizadas usando IA
   */
  async generateCustomClause(request: string, context: string): Promise<string> {
    const prompt = `Como abogado inmobiliario argentino, genera una cláusula legal para la siguiente solicitud:

SOLICITUD: ${request}

CONTEXTO:
${context}

Requisitos:
- La cláusula debe ser legalmente válida en Argentina
- Debe proteger los intereses de las partes involucradas
- Usar lenguaje técnico apropiado
- Ser clara y específica
- Incluir las consecuencias en caso de incumplimiento

Genera solo la cláusula solicitada, sin explicaciones adicionales.`;

    return await this.callOpenAI(prompt);
  }
}

// Exportar instancia singleton
export const documentGenerator = new DocumentGeneratorService();
