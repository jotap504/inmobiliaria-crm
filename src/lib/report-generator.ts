import { ReportConfig, Property, Client, Transaction, User } from '@/types';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface ReportData {
  period: {
    start: Date;
    end: Date;
    type: 'mensual' | 'trimestral' | 'anual' | 'personalizado';
  };
  brokerId: string;
  sections: {
    ventas_cerradas: boolean;
    propiedades_disponibles: boolean;
    pipeline_ventas: boolean;
    metricas_agentes: boolean;
    estado_documentacion: boolean;
  };
  filters?: {
    agent_id?: string;
    property_type?: string;
    price_range?: { min: number; max: number };
    status?: string;
  };
}

export interface ReportMetrics {
  totalVentas: number;
  totalComisiones: number;
  propiedadesVendidas: number;
  promedioDiasVenta: number;
  conversionRate: number;
  leadTime: number;
  topAgentes: Array<{
    id: string;
    name: string;
    ventas: number;
    comisiones: number;
  }>;
  propiedadesPorTipo: Record<string, number>;
  ventasPorMes: Array<{ month: string; ventas: number; monto: number }>;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'table' | 'chart' | 'summary' | 'list';
  data: any;
  order: number;
}

export class ReportGeneratorService {
  /**
   * Genera un reporte completo
   */
  async generateReport(config: ReportConfig, data: ReportData): Promise<{
    pdf: Blob;
    excel: Blob;
    summary: ReportMetrics;
  }> {
    try {
      // Obtener datos del período
      const reportData = await this.collectReportData(data);
      
      // Calcular métricas
      const metrics = this.calculateMetrics(reportData);
      
      // Generar secciones del reporte
      const sections = await this.generateSections(config, reportData, metrics);
      
      // Generar PDF
      const pdf = await this.generatePDF(sections, metrics, data);
      
      // Generar Excel
      const excel = await this.generateExcel(sections, metrics);
      
      return {
        pdf,
        excel,
        summary: metrics,
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Colecta datos para el reporte
   */
  private async collectReportData(data: ReportData) {
    // Aquí irían las llamadas reales a la base de datos
    // Por ahora, simulamos datos
    
    const mockData = {
      ventas: await this.getVentasPeriodo(data.period, data.filters),
      propiedades: await this.getPropiedadesPeriodo(data.period, data.filters),
      clientes: await this.getClientesPeriodo(data.period, data.filters),
      agentes: await this.getAgentesPeriodo(data.brokerId),
      documentos: await this.getDocumentosPendientes(data.brokerId),
    };

    return mockData;
  }

  /**
   * Calcula métricas del reporte
   */
  private calculateMetrics(data: any): ReportMetrics {
    const { ventas, propiedades, agentes } = data;
    
    const totalVentas = ventas.reduce((sum: number, venta: any) => sum + (venta.sale_price || 0), 0);
    const totalComisiones = ventas.reduce((sum: number, venta: any) => {
      const comision = (venta.sale_price || 0) * ((venta.commission_percentage || 0) / 100);
      return sum + comision;
    }, 0);
    
    const propiedadesVendidas = ventas.length;
    
    // Calcular promedio de días en venta
    const diasVenta = ventas.map((venta: any) => {
      const created = new Date(venta.created_at);
      const closed = new Date(venta.actual_closing_date || Date.now());
      return Math.floor((closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    });
    const promedioDiasVenta = diasVenta.length > 0 
      ? diasVenta.reduce((sum: number, dias: number) => sum + dias, 0) / diasVenta.length 
      : 0;

    // Calcular tasa de conversión (simulada)
    const totalPropiedades = propiedades.length;
    const conversionRate = totalPropiedades > 0 ? (propiedadesVendidas / totalPropiedades) * 100 : 0;

    // Top agentes
    const ventasPorAgente = ventas.reduce((acc: any, venta: any) => {
      if (!acc[venta.agent_id]) {
        acc[venta.agent_id] = { id: venta.agent_id, name: venta.agent_name, ventas: 0, comisiones: 0 };
      }
      acc[venta.agent_id].ventas += 1;
      acc[venta.agent_id].comisiones += (venta.sale_price || 0) * ((venta.commission_percentage || 0) / 100);
      return acc;
    }, {});

    const topAgentes = Object.values(ventasPorAgente)
      .sort((a: any, b: any) => b.ventas - a.ventas)
      .slice(0, 5);

    // Propiedades por tipo
    const propiedadesPorTipo = propiedades.reduce((acc: any, prop: any) => {
      acc[prop.property_type] = (acc[prop.property_type] || 0) + 1;
      return acc;
    }, {});

    // Ventas por mes
    const ventasPorMes = this.groupVentasByMonth(ventas);

    return {
      totalVentas,
      totalComisiones,
      propiedadesVendidas,
      promedioDiasVenta,
      conversionRate,
      leadTime: promedioDiasVenta, // Lead time similar a días en venta
      topAgentes,
      propiedadesPorTipo,
      ventasPorMes,
    };
  }

  /**
   * Genera las secciones del reporte
   */
  private async generateSections(config: ReportConfig, data: any, metrics: ReportMetrics): Promise<ReportSection[]> {
    const sections: ReportSection[] = [];
    let order = 1;

    if (config.secciones.ventas_cerradas) {
      sections.push({
        id: 'ventas_cerradas',
        title: 'Ventas Cerradas del Período',
        type: 'table',
        data: {
          headers: ['Propiedad', 'Cliente', 'Agente', 'Precio Venta', 'Comisión', 'Fecha'],
          rows: data.ventas.map((venta: any) => [
            venta.property_title,
            venta.client_name,
            venta.agent_name,
            `$${venta.sale_price?.toLocaleString('es-AR')}`,
            `$${((venta.sale_price || 0) * ((venta.commission_percentage || 0) / 100)).toLocaleString('es-AR')}`,
            new Date(venta.actual_closing_date).toLocaleDateString('es-AR'),
          ]),
        },
        order: order++,
      });
    }

    if (config.secciones.propiedades_disponibles) {
      sections.push({
        id: 'propiedades_disponibles',
        title: 'Propiedades Disponibles',
        type: 'table',
        data: {
          headers: ['Título', 'Tipo', 'Precio', 'Días en Mercado', 'Visitas', 'Interesados'],
          rows: data.propiedades
            .filter((prop: any) => prop.status === 'available')
            .map((prop: any) => [
              prop.title,
              prop.property_type,
              `$${prop.price?.toLocaleString('es-AR')}`,
              this.calculateDaysInMarket(prop.created_at),
              prop.visits || 0,
              prop.interested_count || 0,
            ]),
        },
        order: order++,
      });
    }

    if (config.secciones.pipeline_ventas) {
      sections.push({
        id: 'pipeline_ventas',
        title: 'Pipeline de Ventas',
        type: 'chart',
        data: {
          type: 'funnel',
          stages: [
            { name: 'Contacto', count: data.clientes.length },
            { name: 'Visitas', count: data.propiedades.reduce((sum: number, prop: any) => sum + (prop.visits || 0), 0) },
            { name: 'Interesados', count: data.propiedades.reduce((sum: number, prop: any) => sum + (prop.interested_count || 0), 0) },
            { name: 'Negociación', count: data.ventas.filter((v: any) => v.status === 'negotiation').length },
            { name: 'Boleto', count: data.ventas.filter((v: any) => v.status === 'boleto').length },
            { name: 'Cerradas', count: metrics.propiedadesVendidas },
          ],
        },
        order: order++,
      });
    }

    if (config.secciones.metricas_agentes) {
      sections.push({
        id: 'metricas_agentes',
        title: 'Métricas por Agente',
        type: 'table',
        data: {
          headers: ['Agente', 'Ventas', 'Comisiones', 'Propiedades', 'Tasa Conversión'],
          rows: metrics.topAgentes.map((agente: any) => [
            agente.name,
            agente.ventas,
            `$${agente.comisiones.toLocaleString('es-AR')}`,
            data.propiedades.filter((prop: any) => prop.agent_id === agente.id).length,
            `${((agente.ventas / data.propiedades.filter((prop: any) => prop.agent_id === agente.id).length) * 100).toFixed(1)}%`,
          ]),
        },
        order: order++,
      });
    }

    if (config.secciones.estado_documentacion) {
      sections.push({
        id: 'estado_documentacion',
        title: 'Estado de Documentación',
        type: 'list',
        data: {
          items: data.documentos.map((doc: any) => ({
            title: doc.name,
            status: doc.status,
            dueDate: doc.due_date,
            responsible: doc.responsible,
          })),
        },
        order: order++,
      });
    }

    return sections.sort((a, b) => a.order - b.order);
  }

  /**
   * Genera el PDF del reporte
   */
  private async generatePDF(sections: ReportSection[], metrics: ReportMetrics, data: ReportData): Promise<Blob> {
    const pdf = new jsPDF();
    let yPosition = 20;

    // Título
    pdf.setFontSize(18);
    pdf.text('Reporte Inmobiliario', 20, yPosition);
    yPosition += 15;

    // Período
    pdf.setFontSize(12);
    pdf.text(`Período: ${this.formatPeriod(data.period)}`, 20, yPosition);
    yPosition += 10;

    // Resumen ejecutivo
    pdf.setFontSize(14);
    pdf.text('Resumen Ejecutivo', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.text(`Ventas Totales: $${metrics.totalVentas.toLocaleString('es-AR')}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Comisiones Totales: $${metrics.totalComisiones.toLocaleString('es-AR')}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Propiedades Vendidas: ${metrics.propiedadesVendidas}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Promedio Días en Venta: ${metrics.promedioDiasVenta.toFixed(1)}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Tasa de Conversión: ${metrics.conversionRate.toFixed(1)}%`, 20, yPosition);
    yPosition += 15;

    // Secciones
    sections.forEach(section => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.text(section.title, 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      
      switch (section.type) {
        case 'table':
          yPosition = this.addTableToPDF(pdf, section.data, yPosition);
          break;
        case 'chart':
          yPosition = this.addChartToPDF(pdf, section.data, yPosition);
          break;
        case 'list':
          yPosition = this.addListToPDF(pdf, section.data, yPosition);
          break;
        case 'summary':
          yPosition = this.addSummaryToPDF(pdf, section.data, yPosition);
          break;
      }
      
      yPosition += 15;
    });

    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  }

  /**
   * Genera el Excel del reporte
   */
  private async generateExcel(sections: ReportSection[], metrics: ReportMetrics): Promise<Blob> {
    const wb = XLSX.utils.book_new();
    let worksheetIndex = 0;

    // Hoja de resumen
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Ventas Totales', metrics.totalVentas],
      ['Comisiones Totales', metrics.totalComisiones],
      ['Propiedades Vendidas', metrics.propiedadesVendidas],
      ['Promedio Días en Venta', metrics.promedioDiasVenta.toFixed(1)],
      ['Tasa de Conversión (%)', metrics.conversionRate.toFixed(1)],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumen');

    // Hojas para cada sección
    sections.forEach(section => {
      if (section.type === 'table' && section.data.rows) {
        const tableData = [section.data.headers, ...section.data.rows];
        const ws = XLSX.utils.aoa_to_sheet(tableData);
        XLSX.utils.book_append_sheet(wb, ws, section.title.substring(0, 31)); // Excel limita a 31 caracteres
      }
    });

    // Hoja de top agentes
    if (metrics.topAgentes.length > 0) {
      const agentesData = [
        ['Agente', 'Ventas', 'Comisiones'],
        ...metrics.topAgentes.map(agente => [
          agente.name,
          agente.ventas,
          agente.comisiones,
        ]),
      ];
      const agentesWs = XLSX.utils.aoa_to_sheet(agentesData);
      XLSX.utils.book_append_sheet(wb, agentesWs, 'Top Agentes');
    }

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  /**
   * Agrega una tabla al PDF
   */
  private addTableToPDF(pdf: jsPDF, tableData: any, yPosition: number): number {
    const { headers, rows } = tableData;
    const columnWidth = 170 / headers.length;

    // Headers
    pdf.setFontSize(9);
    headers.forEach((header: string, index: number) => {
      pdf.text(header, 20 + (index * columnWidth), yPosition);
    });
    yPosition += 7;

    // Rows
    pdf.setFontSize(8);
    rows.forEach((row: string[]) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      row.forEach((cell: string, index: number) => {
        pdf.text(cell.substring(0, 20), 20 + (index * columnWidth), yPosition);
      });
      yPosition += 6;
    });

    return yPosition;
  }

  /**
   * Agrega un gráfico al PDF (simplificado)
   */
  private addChartToPDF(pdf: jsPDF, chartData: any, yPosition: number): number {
    pdf.setFontSize(9);
    pdf.text('Gráfico: ' + chartData.type, 20, yPosition);
    yPosition += 10;

    if (chartData.type === 'funnel') {
      chartData.stages.forEach((stage: any, index: number) => {
        pdf.text(`${stage.name}: ${stage.count}`, 30, yPosition);
        yPosition += 7;
      });
    }

    return yPosition;
  }

  /**
   * Agrega una lista al PDF
   */
  private addListToPDF(pdf: jsPDF, listData: any, yPosition: number): number {
    pdf.setFontSize(9);
    listData.items.forEach((item: any) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`• ${item.title} - ${item.status}`, 25, yPosition);
      yPosition += 7;
    });
    return yPosition;
  }

  /**
   * Agrega un resumen al PDF
   */
  private addSummaryToPDF(pdf: jsPDF, summaryData: any, yPosition: number): number {
    pdf.setFontSize(9);
    Object.entries(summaryData).forEach(([key, value]) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`${key}: ${value}`, 25, yPosition);
      yPosition += 7;
    });
    return yPosition;
  }

  /**
   * Funciones utilitarias
   */
  private formatPeriod(period: any): string {
    const { start, end, type } = period;
    const startStr = new Date(start).toLocaleDateString('es-AR');
    const endStr = new Date(end).toLocaleDateString('es-AR');
    
    switch (type) {
      case 'mensual':
        return `${new Date(start).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}`;
      case 'trimestral':
        return `Trimestre ${Math.ceil((new Date(start).getMonth() + 1) / 3)} ${new Date(start).getFullYear()}`;
      case 'anual':
        return `${new Date(start).getFullYear()}`;
      default:
        return `${startStr} - ${endStr}`;
    }
  }

  private calculateDaysInMarket(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }

  private groupVentasByMonth(ventas: any[]): Array<{ month: string; ventas: number; monto: number }> {
    const grouped = ventas.reduce((acc: any, venta: any) => {
      const month = new Date(venta.actual_closing_date).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month, ventas: 0, monto: 0 };
      }
      acc[month].ventas += 1;
      acc[month].monto += venta.sale_price || 0;
      return acc;
    }, {});

    return Object.values(grouped);
  }

  // Métodos simulados - en producción llamarían a la base de datos
  private async getVentasPeriodo(period: any, filters?: any): Promise<any[]> {
    // Simulación
    return [
      {
        id: '1',
        property_title: 'Depto 2 ambientes Palermo',
        client_name: 'Juan Pérez',
        agent_name: 'Carlos López',
        sale_price: 120000,
        commission_percentage: 3,
        actual_closing_date: '2024-01-15',
        created_at: '2023-12-01',
        agent_id: 'agent1',
      },
    ];
  }

  private async getPropiedadesPeriodo(period: any, filters?: any): Promise<any[]> {
    // Simulación
    return [
      {
        id: '1',
        title: 'Casa 3 ambientes Belgrano',
        property_type: 'house',
        price: 280000,
        status: 'available',
        created_at: '2024-01-01',
        agent_id: 'agent1',
        visits: 15,
        interested_count: 7,
      },
    ];
  }

  private async getClientesPeriodo(period: any, filters?: any): Promise<any[]> {
    return [];
  }

  private async getAgentesPeriodo(brokerId: string): Promise<any[]> {
    return [];
  }

  private async getDocumentosPendientes(brokerId: string): Promise<any[]> {
    return [];
  }
}

// Exportar instancia singleton
export const reportGenerator = new ReportGeneratorService();
