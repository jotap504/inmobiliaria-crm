import { TaxConfig, TaxCalculation, TaxItem } from '@/types';

// Default tax configuration for Argentina
export const defaultTaxConfig: TaxConfig[] = [
  {
    id: 'impuesto_sellos',
    nombre: 'Impuesto de Sellos',
    porcentaje: 1.5,
    base_calculo: 'precio_venta',
    aplica: true,
    tipo: 'porcentaje',
  },
  {
    id: 'gastos_administrativos',
    nombre: 'Gastos Administrativos',
    porcentaje: 0.5,
    base_calculo: 'precio_venta',
    aplica: true,
    tipo: 'porcentaje',
  },
  {
    id: 'honorarios_escribano',
    nombre: 'Honorarios Escribano',
    porcentaje: 1.5,
    base_calculo: 'precio_venta',
    aplica: true,
    tipo: 'porcentaje',
  },
  {
    id: 'comision_inmobiliaria',
    nombre: 'Comisión Inmobiliaria',
    porcentaje: 3,
    base_calculo: 'precio_venta',
    aplica: true,
    tipo: 'porcentaje',
  },
  {
    id: 'iti_caba',
    nombre: 'ITI - CABA',
    porcentaje: 2,
    base_calculo: 'precio_venta',
    aplica: false,
    condicion: 'caba',
    tipo: 'porcentaje',
  },
  {
    id: 'iti_buenos_aires',
    nombre: 'ITI - Provincia de Buenos Aires',
    porcentaje: 1.5,
    base_calculo: 'precio_venta',
    aplica: false,
    condicion: 'provincia_buenos_aires',
    tipo: 'porcentaje',
  },
  {
    id: 'certificado_libre_deuda',
    nombre: 'Certificado Libre Deuda',
    monto_fijo: 5000,
    base_calculo: 'precio_venta',
    aplica: true,
    tipo: 'fijo',
  },
];

export class TaxCalculator {
  private taxConfig: TaxConfig[];

  constructor(customConfig?: TaxConfig[]) {
    this.taxConfig = customConfig || defaultTaxConfig;
  }

  calculate(propertyPrice: number, province?: string, customTaxes?: TaxConfig[]): TaxCalculation {
    const taxesToUse = customTaxes || this.taxConfig;
    const applicableTaxes = taxesToUse.filter(tax => this.isTaxApplicable(tax, province));
    
    const impuestos: TaxItem[] = applicableTaxes.map(tax => {
      const baseCalculo = this.getBaseCalculo(tax, propertyPrice, impuestos);
      const monto = this.calculateTaxAmount(tax, baseCalculo);
      
      return {
        nombre: tax.nombre,
        monto,
        porcentaje: tax.tipo === 'porcentaje' ? tax.porcentaje : undefined,
        base_calculo: baseCalculo,
      };
    });

    const totalImpuestos = impuestos.reduce((sum, imp) => sum + imp.monto, 0);
    const costoTotal = propertyPrice + totalImpuestos;

    return {
      property_id: '',
      precio_venta: propertyPrice,
      impuestos,
      total_impuestos: totalImpuestos,
      costo_total: costoTotal,
      created_at: new Date().toISOString(),
    };
  }

  private isTaxApplicable(tax: TaxConfig, province?: string): boolean {
    if (!tax.aplica) return false;
    
    if (tax.condicion) {
      switch (tax.condicion) {
        case 'caba':
          return province?.toLowerCase() === 'caba' || province?.toLowerCase() === 'capital federal';
        case 'provincia_buenos_aires':
          return province?.toLowerCase() === 'buenos aires' || province?.toLowerCase() === 'provincia de buenos aires';
        default:
          return false;
      }
    }
    
    return true;
  }

  private getBaseCalculo(tax: TaxConfig, propertyPrice: number, calculatedTaxes: TaxItem[]): number {
    if (tax.base_calculo === 'precio_venta') {
      return propertyPrice;
    }
    
    if (tax.base_calculo === 'precio_venta_menos_costos') {
      const previousCosts = calculatedTaxes
        .filter(t => t.nombre !== tax.nombre)
        .reduce((sum, t) => sum + t.monto, 0);
      return propertyPrice - previousCosts;
    }
    
    return propertyPrice;
  }

  private calculateTaxAmount(tax: TaxConfig, baseCalculo: number): number {
    switch (tax.tipo) {
      case 'porcentaje':
        return (baseCalculo * tax.porcentaje) / 100;
      case 'fijo':
        return tax.monto_fijo || 0;
      case 'escalable':
        // Implementar lógica para impuestos escalables si es necesario
        return (baseCalculo * tax.porcentaje) / 100;
      default:
        return 0;
    }
  }

  updateTaxConfig(newConfig: TaxConfig[]): void {
    this.taxConfig = newConfig;
  }

  getTaxConfig(): TaxConfig[] {
    return this.taxConfig;
  }

  exportToExcel(calculation: TaxCalculation): Blob {
    // Implementar exportación a Excel
    const headers = ['Concepto', 'Base de Cálculo', 'Porcentaje', 'Monto'];
    const rows = calculation.impuestos.map(imp => [
      imp.nombre,
      imp.base_calculo.toString(),
      imp.porcentaje ? `${imp.porcentaje}%` : '-',
      `$${imp.monto.toLocaleString('es-AR')}`
    ]);

    rows.push(['', '', '', '']);
    rows.push(['Precio Venta', '', '', `$${calculation.precio_venta.toLocaleString('es-AR')}`]);
    rows.push(['Total Impuestos', '', '', `$${calculation.total_impuestos.toLocaleString('es-AR')}`]);
    rows.push(['Costo Total', '', '', `$${calculation.costo_total.toLocaleString('es-AR')}`]);

    // Aquí iría la implementación real con una librería como xlsx
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }
}

// Singleton instance
export const taxCalculator = new TaxCalculator();
