import { TaxConfig } from '@/types';

export interface ProvinceTaxConfig {
  province: string;
  provinceCode: string;
  itiRate: number; // Impuesto a la Transferencia Inmobiliaria
  plusvalia?: number; // Impuesto a las Ganancias por Plusvalía
  sellRate: number; // Impuesto de Sellos
  additionalTaxes: TaxConfig[];
  specialConditions: {
    minPriceForPlusvalia?: number;
    exemptions?: string[];
    specialRates?: Array<{
      condition: string;
      rate: number;
      description: string;
    }>;
  };
}

export class ProvinceTaxConfigService {
  private provinceConfigs: ProvinceTaxConfig[] = [
    {
      province: 'Capital Federal',
      provinceCode: 'CABA',
      itiRate: 2.0,
      sellRate: 1.5,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_caba',
          nombre: 'Gastos Administrativos CABA',
          porcentaje: 0.5,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
        {
          id: 'certificado_libre_deuda_caba',
          nombre: 'Certificado Libre Deuda GCBA',
          monto_fijo: 3500,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'fijo',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 31500000, // Mínimo para plusvalía en CABA
        exemptions: ['vivienda_unique', 'primer_vivienda'],
        specialRates: [
          {
            condition: 'primer_vivienda',
            rate: 1.0,
            description: 'ITI reducido para primera vivienda',
          },
          {
            condition: 'vivienda_social',
            rate: 0.5,
            description: 'ITI reducido para vivienda social',
          },
        ],
      },
    },
    {
      province: 'Buenos Aires',
      provinceCode: 'BA',
      itiRate: 1.5,
      sellRate: 1.0,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_ba',
          nombre: 'Gastos Administrativos PBA',
          porcentaje: 0.3,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
        {
          id: 'estado_parcelario_ba',
          nombre: 'Estado Parcelario',
          monto_fijo: 8000,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'fijo',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 20000000,
        exemptions: ['vivienda_unique', 'primer_vivienda'],
      },
    },
    {
      province: 'Córdoba',
      provinceCode: 'CB',
      itiRate: 1.5,
      sellRate: 1.0,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_cb',
          nombre: 'Gastos Administrativos Córdoba',
          porcentaje: 0.4,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 15000000,
      },
    },
    {
      province: 'Santa Fe',
      provinceCode: 'SF',
      itiRate: 1.5,
      sellRate: 1.2,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_sf',
          nombre: 'Gastos Administrativos Santa Fe',
          porcentaje: 0.5,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 18000000,
      },
    },
    {
      province: 'Mendoza',
      provinceCode: 'MZ',
      itiRate: 1.8,
      sellRate: 1.5,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_mz',
          nombre: 'Gastos Administrativos Mendoza',
          porcentaje: 0.6,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 12000000,
      },
    },
    {
      province: 'Tucumán',
      provinceCode: 'TM',
      itiRate: 2.0,
      sellRate: 1.5,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_tm',
          nombre: 'Gastos Administrativos Tucumán',
          porcentaje: 0.7,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 10000000,
      },
    },
    {
      province: 'Entre Ríos',
      provinceCode: 'ER',
      itiRate: 1.5,
      sellRate: 1.0,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_er',
          nombre: 'Gastos Administrativos Entre Ríos',
          porcentaje: 0.4,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 8000000,
      },
    },
    {
      province: 'Misiones',
      provinceCode: 'MI',
      itiRate: 1.8,
      sellRate: 1.5,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_mi',
          nombre: 'Gastos Administrativos Misiones',
          porcentaje: 0.8,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 6000000,
      },
    },
    {
      province: 'Salta',
      provinceCode: 'SA',
      itiRate: 2.2,
      sellRate: 1.8,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_sa',
          nombre: 'Gastos Administrativos Salta',
          porcentaje: 0.9,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 7000000,
      },
    },
    {
      province: 'San Juan',
      provinceCode: 'SJ',
      itiRate: 2.0,
      sellRate: 1.5,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_sj',
          nombre: 'Gastos Administrativos San Juan',
          porcentaje: 0.7,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 9000000,
      },
    },
    {
      province: 'Río Negro',
      provinceCode: 'RN',
      itiRate: 1.8,
      sellRate: 1.2,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_rn',
          nombre: 'Gastos Administrativos Río Negro',
          porcentaje: 0.6,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 11000000,
      },
    },
    {
      province: 'Neuquén',
      provinceCode: 'NQ',
      itiRate: 1.8,
      sellRate: 1.5,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_nq',
          nombre: 'Gastos Administrativos Neuquén',
          porcentaje: 0.8,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 13000000,
      },
    },
    {
      province: 'Formosa',
      provinceCode: 'FO',
      itiRate: 2.5,
      sellRate: 2.0,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_fo',
          nombre: 'Gastos Administrativos Formosa',
          porcentaje: 1.0,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 5000000,
      },
    },
    {
      province: 'Chaco',
      provinceCode: 'CH',
      itiRate: 2.3,
      sellRate: 1.8,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_ch',
          nombre: 'Gastos Administrativos Chaco',
          porcentaje: 0.9,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 6000000,
      },
    },
    {
      province: 'San Luis',
      provinceCode: 'SL',
      itiRate: 1.8,
      sellRate: 1.2,
      plusvalia: 1.5,
      additionalTaxes: [
        {
          id: 'gastos_administrativos_sl',
          nombre: 'Gastos Administrativos San Luis',
          porcentaje: 0.6,
          base_calculo: 'precio_venta',
          aplica: true,
          tipo: 'porcentaje',
        },
      ],
      specialConditions: {
        minPriceForPlusvalia: 8500000,
      },
    },
  ];

  /**
   * Obtiene la configuración de impuestos para una provincia
   */
  getProvinceConfig(provinceName: string): ProvinceTaxConfig | null {
    return this.provinceConfigs.find(config => 
      config.province.toLowerCase() === provinceName.toLowerCase() ||
      config.provinceCode.toLowerCase() === provinceName.toLowerCase()
    ) || null;
  }

  /**
   * Obtiene todas las provincias disponibles
   */
  getAllProvinces(): Array<{ name: string; code: string }> {
    return this.provinceConfigs.map(config => ({
      name: config.province,
      code: config.provinceCode,
    }));
  }

  /**
   * Genera la configuración de impuestos completa para una provincia
   */
  generateTaxConfigForProvince(
    provinceName: string, 
    customConditions?: {
      isFirstHome?: boolean;
      isSocialHousing?: boolean;
      propertyType?: string;
      buyerType?: string;
    }
  ): TaxConfig[] {
    const provinceConfig = this.getProvinceConfig(provinceName);
    if (!provinceConfig) {
      throw new Error(`Provincia "${provinceName}" no encontrada en la configuración`);
    }

    const taxConfig: TaxConfig[] = [
      // Impuesto de Sellos provincial
      {
        id: `impuesto_sellos_${provinceConfig.provinceCode}`,
        nombre: `Impuesto de Sellos - ${provinceConfig.province}`,
        porcentaje: provinceConfig.sellRate,
        base_calculo: 'precio_venta',
        aplica: true,
        provincia: provinceConfig.province,
        tipo: 'porcentaje',
      },
      // ITI provincial
      {
        id: `iti_${provinceConfig.provinceCode}`,
        nombre: `ITI - ${provinceConfig.province}`,
        porcentaje: provinceConfig.itiRate,
        base_calculo: 'precio_venta',
        aplica: true,
        provincia: provinceConfig.province,
        tipo: 'porcentaje',
      },
      // Plusvalía (si aplica)
      ...(provinceConfig.plusvalia ? [{
        id: `plusvalia_${provinceConfig.provinceCode}`,
        nombre: `Plusvalía - ${provinceConfig.province}`,
        porcentaje: provinceConfig.plusvalia,
        base_calculo: 'precio_venta',
        aplica: true,
        condicion: `precio_mayor_a_${provinceConfig.specialConditions.minPriceForPlusvalia}`,
        provincia: provinceConfig.province,
        tipo: 'porcentaje',
      }] : []),
      // Impuestos adicionales de la provincia
      ...provinceConfig.additionalTaxes,
    ];

    // Aplicar condiciones especiales
    if (customConditions && provinceConfig.specialConditions.specialRates) {
      const specialRate = provinceConfig.specialConditions.specialRates.find(rate => 
        (customConditions.isFirstHome && rate.condition === 'primer_vivienda') ||
        (customConditions.isSocialHousing && rate.condition === 'vivienda_social')
      );

      if (specialRate) {
        // Modificar ITI con tasa especial
        const itiIndex = taxConfig.findIndex(tax => tax.id === `iti_${provinceConfig.provinceCode}`);
        if (itiIndex !== -1) {
          taxConfig[itiIndex].porcentaje = specialRate.rate;
          taxConfig[itiIndex].nombre += ` - Tasa Especial`;
        }
      }
    }

    return taxConfig;
  }

  /**
   * Verifica si una propiedad está exenta de algún impuesto
   */
  checkExemptions(
    provinceName: string,
    propertyValue: number,
    conditions: {
      isFirstHome?: boolean;
      isSocialHousing?: boolean;
      ownerAge?: number;
      propertyType?: string;
    }
  ): { tax: string; exempt: boolean; reason: string }[] {
    const provinceConfig = this.getProvinceConfig(provinceName);
    if (!provinceConfig) {
      return [];
    }

    const exemptions: { tax: string; exempt: boolean; reason: string }[] = [];

    // Exención por primera vivienda
    if (conditions.isFirstHome && provinceConfig.specialConditions.exemptions?.includes('primer_vivienda')) {
      exemptions.push({
        tax: 'ITI',
        exempt: true,
        reason: 'Exención por primera vivienda',
      });
    }

    // Exención por vivienda única
    if (conditions.isFirstHome && provinceConfig.specialConditions.exemptions?.includes('vivienda_unique')) {
      exemptions.push({
        tax: 'Plusvalía',
        exempt: true,
        reason: 'Exención por vivienda única',
      });
    }

    // Exención por plusvalía (si el valor es bajo)
    if (provinceConfig.specialConditions.minPriceForPlusvalia && 
        propertyValue < provinceConfig.specialConditions.minPriceForPlusvalia) {
      exemptions.push({
        tax: 'Plusvalía',
        exempt: true,
        reason: `Valor por debajo del mínimo (${provinceConfig.specialConditions.minPriceForPlusvalia.toLocaleString('es-AR')})`,
      });
    }

    return exemptions;
  }

  /**
   * Calcula impuestos específicos de una provincia
   */
  calculateProvincialTaxes(
    provinceName: string,
    propertyValue: number,
    customConditions?: any
  ): { total: number; breakdown: Array<{ name: string; amount: number; rate?: number }> } {
    const taxConfig = this.generateTaxConfigForProvince(provinceName, customConditions);
    const breakdown: Array<{ name: string; amount: number; rate?: number }> = [];
    let total = 0;

    taxConfig.forEach(tax => {
      if (tax.aplica) {
        let amount = 0;
        
        if (tax.tipo === 'porcentaje' && tax.porcentaje) {
          amount = (propertyValue * tax.porcentaje) / 100;
        } else if (tax.tipo === 'fijo' && tax.monto_fijo) {
          amount = tax.monto_fijo;
        }

        breakdown.push({
          name: tax.nombre,
          amount,
          rate: tax.porcentaje,
        });
        
        total += amount;
      }
    });

    return { total, breakdown };
  }

  /**
   * Compara impuestos entre provincias
   */
  compareProvinces(propertyValue: number): Array<{
    province: string;
    totalTaxes: number;
    effectiveRate: number;
    breakdown: Array<{ name: string; amount: number }>;
  }> {
    return this.provinceConfigs.map(config => {
      const { total, breakdown } = this.calculateProvincialTaxes(config.province, propertyValue);
      const effectiveRate = (total / propertyValue) * 100;

      return {
        province: config.province,
        totalTaxes: total,
        effectiveRate,
        breakdown,
      };
    }).sort((a, b) => a.totalTaxes - b.totalTaxes);
  }

  /**
   * Actualiza la configuración de una provincia
   */
  updateProvinceConfig(provinceCode: string, updates: Partial<ProvinceTaxConfig>): boolean {
    const index = this.provinceConfigs.findIndex(config => config.provinceCode === provinceCode);
    if (index === -1) return false;

    this.provinceConfigs[index] = { ...this.provinceConfigs[index], ...updates };
    return true;
  }

  /**
   * Agrega una nueva provincia a la configuración
   */
  addProvince(config: ProvinceTaxConfig): void {
    // Verificar que no exista
    const exists = this.provinceConfigs.some(c => 
      c.provinceCode === config.provinceCode || 
      c.province.toLowerCase() === config.province.toLowerCase()
    );

    if (exists) {
      throw new Error(`La provincia "${config.province}" ya existe en la configuración`);
    }

    this.provinceConfigs.push(config);
  }

  /**
   * Exporta la configuración a JSON
   */
  exportConfig(): string {
    return JSON.stringify(this.provinceConfigs, null, 2);
  }

  /**
   * Importa configuración desde JSON
   */
  importConfig(configJson: string): void {
    try {
      const imported = JSON.parse(configJson) as ProvinceTaxConfig[];
      
      // Validar estructura
      imported.forEach(config => {
        if (!config.province || !config.provinceCode || config.itiRate === undefined) {
          throw new Error(`Configuración inválida para ${config.province}`);
        }
      });

      this.provinceConfigs = imported;
    } catch (error) {
      throw new Error('Error al importar configuración: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }
}

// Exportar instancia singleton
export const provinceTaxConfig = new ProvinceTaxConfigService();
