import * as XLSX from 'xlsx';
import { Property, ImportConfig } from '@/types';

export interface PropertyImportData {
  title: string;
  description?: string;
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
  images?: string[];
}

export interface ImportResult {
  success: boolean;
  properties: Property[];
  errors: string[];
  totalProcessed: number;
  totalImported: number;
  duplicates: number;
}

export interface FieldMapping {
  sourceField: string;
  targetField: keyof PropertyImportData;
  required: boolean;
  transform?: (value: any) => any;
}

export class PropertyImportService {
  private defaultFieldMappings: FieldMapping[] = [
    { sourceField: 'título', targetField: 'title', required: true },
    { sourceField: 'titulo', targetField: 'title', required: true },
    { sourceField: 'title', targetField: 'title', required: true },
    { sourceField: 'descripción', targetField: 'description', required: false },
    { sourceField: 'descripcion', targetField: 'description', required: false },
    { sourceField: 'description', targetField: 'description', required: false },
    { sourceField: 'dirección', targetField: 'address', required: true },
    { sourceField: 'direccion', targetField: 'address', required: true },
    { sourceField: 'address', targetField: 'address', required: true },
    { sourceField: 'ciudad', targetField: 'city', required: true },
    { sourceField: 'city', targetField: 'city', required: true },
    { sourceField: 'provincia', targetField: 'province', required: true },
    { sourceField: 'province', targetField: 'province', required: true },
    { sourceField: 'precio', targetField: 'price', required: true, transform: this.parseNumber },
    { sourceField: 'price', targetField: 'price', required: true, transform: this.parseNumber },
    { sourceField: 'moneda', targetField: 'currency', required: false, transform: this.parseCurrency },
    { sourceField: 'currency', targetField: 'currency', required: false, transform: this.parseCurrency },
    { sourceField: 'tipo', targetField: 'property_type', required: true, transform: this.parsePropertyType },
    { sourceField: 'tipo_propiedad', targetField: 'property_type', required: true, transform: this.parsePropertyType },
    { sourceField: 'property_type', targetField: 'property_type', required: true, transform: this.parsePropertyType },
    { sourceField: 'dormitorios', targetField: 'bedrooms', required: false, transform: this.parseNumber },
    { sourceField: 'bedrooms', targetField: 'bedrooms', required: false, transform: this.parseNumber },
    { sourceField: 'baños', targetField: 'bathrooms', required: false, transform: this.parseNumber },
    { sourceField: 'bathrooms', targetField: 'bathrooms', required: false, transform: this.parseNumber },
    { sourceField: 'superficie_total', targetField: 'surface_total', required: true, transform: this.parseNumber },
    { sourceField: 'surface_total', targetField: 'surface_total', required: true, transform: this.parseNumber },
    { sourceField: 'superficie_cubierta', targetField: 'surface_covered', required: false, transform: this.parseNumber },
    { sourceField: 'surface_covered', targetField: 'surface_covered', required: false, transform: this.parseNumber },
    { sourceField: 'expensas', targetField: 'expenses', required: false, transform: this.parseNumber },
    { sourceField: 'expenses', targetField: 'expenses', required: false, transform: this.parseNumber },
  ];

  /**
   * Importa propiedades desde un archivo Excel/CSV
   */
  async importFromFile(file: File, customMappings?: FieldMapping[]): Promise<ImportResult> {
    try {
      const mappings = customMappings || this.defaultFieldMappings;
      const data = await this.parseFile(file);
      const result = await this.processImportData(data, mappings);
      
      return result;
    } catch (error) {
      console.error('Error importing properties:', error);
      return {
        success: false,
        properties: [],
        errors: [error instanceof Error ? error.message : 'Error desconocido'],
        totalProcessed: 0,
        totalImported: 0,
        duplicates: 0,
      };
    }
  }

  /**
   * Parsea un archivo Excel o CSV
   */
  private async parseFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Tomar la primera hoja
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            reject(new Error('El archivo está vacío'));
            return;
          }
          
          // La primera fila contiene los encabezados
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1);
          
          // Convertir a objetos
          const objects = rows.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              if (header && header.trim()) {
                obj[header.trim()] = row[index];
              }
            });
            return obj;
          }).filter(row => Object.keys(row).length > 0);
          
          resolve(objects);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Procesa los datos importados
   */
  private async processImportData(data: any[], mappings: FieldMapping[]): Promise<ImportResult> {
    const properties: Property[] = [];
    const errors: string[] = [];
    let duplicates = 0;

    for (let i = 0; i < data.length; i++) {
      try {
        const rowData = data[i];
        const propertyData = this.mapFields(rowData, mappings);
        
        // Validar datos requeridos
        const validationError = this.validatePropertyData(propertyData, i + 1);
        if (validationError) {
          errors.push(validationError);
          continue;
        }

        // Verificar duplicados (aquí iría la lógica de verificación en la base de datos)
        // const isDuplicate = await this.checkDuplicate(propertyData);
        // if (isDuplicate) {
        //   duplicates++;
        //   continue;
        // }

        // Crear objeto Property
        const property: Property = {
          id: `import_${Date.now()}_${i}`,
          ...propertyData,
          status: 'available',
          agent_id: '', // Se asignará después
          broker_id: '', // Se asignará después
          images: propertyData.images || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        properties.push(property);
      } catch (error) {
        errors.push(`Fila ${i + 1}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }

    return {
      success: properties.length > 0,
      properties,
      errors,
      totalProcessed: data.length,
      totalImported: properties.length,
      duplicates,
    };
  }

  /**
   * Mapea los campos del archivo a los campos del sistema
   */
  private mapFields(rowData: any, mappings: FieldMapping[]): PropertyImportData {
    const mappedData: any = {};

    mappings.forEach(mapping => {
      const value = rowData[mapping.sourceField];
      if (value !== undefined && value !== null && value !== '') {
        if (mapping.transform) {
          mappedData[mapping.targetField] = mapping.transform(value);
        } else {
          mappedData[mapping.targetField] = value;
        }
      } else if (mapping.required) {
        throw new Error(`El campo requerido "${mapping.sourceField}" está vacío`);
      }
    });

    return mappedData;
  }

  /**
   * Valida los datos de una propiedad
   */
  private validatePropertyData(data: PropertyImportData, rowNumber: number): string | null {
    if (!data.title || data.title.trim() === '') {
      return `Fila ${rowNumber}: El título es requerido`;
    }

    if (!data.address || data.address.trim() === '') {
      return `Fila ${rowNumber}: La dirección es requerida`;
    }

    if (!data.city || data.city.trim() === '') {
      return `Fila ${rowNumber}: La ciudad es requerida`;
    }

    if (!data.province || data.province.trim() === '') {
      return `Fila ${rowNumber}: La provincia es requerida`;
    }

    if (!data.price || data.price <= 0) {
      return `Fila ${rowNumber}: El precio debe ser mayor a 0`;
    }

    if (!data.surface_total || data.surface_total <= 0) {
      return `Fila ${rowNumber}: La superficie total debe ser mayor a 0`;
    }

    if (!data.property_type) {
      return `Fila ${rowNumber}: El tipo de propiedad es requerido`;
    }

    return null;
  }

  /**
   * Funciones de transformación
   */
  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Limpiar el valor (quitar $, puntos, etc.)
      const cleanValue = value.replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  private parseCurrency(value: any): 'ARS' | 'USD' {
    if (typeof value === 'string') {
      const upper = value.toUpperCase().trim();
      if (upper.includes('USD') || upper.includes('$') && !upper.includes('ARS')) {
        return 'USD';
      }
    }
    return 'ARS'; // Default a pesos argentinos
  }

  private parsePropertyType(value: any): 'house' | 'apartment' | 'land' | 'commercial' {
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      
      if (lower.includes('casa') || lower.includes('house')) return 'house';
      if (lower.includes('departamento') || lower.includes('apartment') || lower.includes('depto')) return 'apartment';
      if (lower.includes('terreno') || lower.includes('land') || lower.includes('lote')) return 'land';
      if (lower.includes('comercial') || lower.includes('commercial') || lower.includes('oficina')) return 'commercial';
    }
    return 'apartment'; // Default
  }

  /**
   * Importa desde APIs externas (ZonaProp, Mercado Libre, etc.)
   */
  async importFromAPI(config: ImportConfig): Promise<ImportResult> {
    try {
      let data: any[] = [];

      switch (config.fuente) {
        case 'api_zonaprop':
          data = await this.importFromZonaProp(config);
          break;
        case 'api_mercadolibre':
          data = await this.importFromMercadoLibre(config);
          break;
        case 'custom_api':
          data = await this.importFromCustomAPI(config);
          break;
        default:
          throw new Error('Fuente de importación no soportada');
      }

      // Mapear campos usando la configuración
      const mappings = Object.entries(config.mapeo_campos).map(([source, target]) => ({
        sourceField: source,
        targetField: target as keyof PropertyImportData,
        required: ['title', 'address', 'city', 'province', 'price', 'surface_total'].includes(target),
        transform: this.getTransformForField(target),
      }));

      return await this.processImportData(data, mappings);
    } catch (error) {
      console.error('Error importing from API:', error);
      return {
        success: false,
        properties: [],
        errors: [error instanceof Error ? error.message : 'Error en la importación desde API'],
        totalProcessed: 0,
        totalImported: 0,
        duplicates: 0,
      };
    }
  }

  private async importFromZonaProp(config: ImportConfig): Promise<any[]> {
    // Implementar llamada a API de ZonaProp
    // Esto es un ejemplo - necesitarás las credenciales reales
    const response = await fetch('https://api.zonaprop.com.ar/v1/properties', {
      headers: {
        'Authorization': `Bearer ${config.api_config?.headers?.['Authorization']}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos de ZonaProp');
    }

    const data = await response.json();
    return data.properties || [];
  }

  private async importFromMercadoLibre(config: ImportConfig): Promise<any[]> {
    // Implementar llamada a API de Mercado Libre
    const response = await fetch('https://api.mercadolibre.com/sites/MLA/search?category=MLA1459', {
      headers: {
        'Authorization': `Bearer ${config.api_config?.headers?.['Authorization']}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos de Mercado Libre');
    }

    const data = await response.json();
    return data.results || [];
  }

  private async importFromCustomAPI(config: ImportConfig): Promise<any[]> {
    if (!config.api_config?.url) {
      throw new Error('URL de API personalizada no configurada');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.api_config.headers,
    };

    const response = await fetch(config.api_config.url, { headers });

    if (!response.ok) {
      throw new Error(`Error en API personalizada: ${response.status}`);
    }

    return await response.json();
  }

  private getTransformForField(field: string): ((value: any) => any) | undefined {
    switch (field) {
      case 'price':
      case 'surface_total':
      case 'surface_covered':
      case 'expenses':
      case 'bedrooms':
      case 'bathrooms':
        return this.parseNumber;
      case 'currency':
        return this.parseCurrency;
      case 'property_type':
        return this.parsePropertyType;
      default:
        return undefined;
    }
  }

  /**
   * Genera una plantilla de Excel para importación
   */
  generateTemplate(): Blob {
    const headers = [
      'título',
      'descripción',
      'dirección',
      'ciudad',
      'provincia',
      'precio',
      'moneda',
      'tipo_propiedad',
      'dormitorios',
      'baños',
      'superficie_total',
      'superficie_cubierta',
      'expensas',
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Propiedades');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}

// Exportar instancia singleton
export const propertyImportService = new PropertyImportService();
