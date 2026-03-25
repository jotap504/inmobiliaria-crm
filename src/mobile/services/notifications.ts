import PushNotification, { 
  Importance, 
  PushNotificationObject,
  PushNotificationScheduleObject 
} from 'react-native-push-notification';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationConfig {
  title: string;
  message: string;
  data?: Record<string, any>;
  channelId?: string;
  priority?: 'default' | 'high' | 'max';
  sound?: string;
  vibrate?: boolean;
  actions?: Array<{
    title: string;
    icon?: string;
    onPress: () => void;
  }>;
}

export interface ScheduledNotification {
  id: string;
  date: Date;
  config: NotificationConfig;
  repeatType?: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

export class NotificationService {
  private isInitialized = false;
  private notificationChannels = {
    DEFAULT: 'default',
    VISITS: 'property_visits',
    DOCUMENTS: 'documentation',
    CLIENTS: 'client_updates',
    SYSTEM: 'system_alerts',
  };

  constructor() {
    this.initialize();
  }

  /**
   * Inicializa el servicio de notificaciones
   */
  private async initialize() {
    if (this.isInitialized) return;

    PushNotification.configure({
      onRegister: async (token) => {
        console.log('Push notification token:', token);
        await this.saveToken(token);
      },

      onNotification: (notification) => {
        console.log('Notification received:', notification);
        this.handleNotification(notification);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Crear canales de notificación (Android)
    if (Platform.OS === 'android') {
      this.createNotificationChannels();
    }

    this.isInitialized = true;
  }

  /**
   * Crea los canales de notificación para Android
   */
  private createNotificationChannels() {
    Object.entries(this.notificationChannels).forEach(([key, channelId]) => {
      PushNotification.createChannel(
        {
          channelId,
          channelName: this.getChannelName(key),
          channelDescription: this.getChannelDescription(key),
          playSound: true,
          soundName: 'default',
          importance: this.getChannelImportance(key),
          vibrate: true,
        },
        (created) => {
          console.log(`Channel ${channelId} created:`, created);
        }
      );
    });
  }

  private getChannelName(key: string): string {
    switch (key) {
      case 'VISITS': return 'Visitas a Propiedades';
      case 'DOCUMENTS': return 'Documentación';
      case 'CLIENTS': return 'Actualizaciones de Clientes';
      case 'SYSTEM': return 'Alertas del Sistema';
      default: return 'Notificaciones Generales';
    }
  }

  private getChannelDescription(key: string): string {
    switch (key) {
      case 'VISITS': return 'Recordatorios y actualizaciones sobre visitas';
      case 'DOCUMENTS': return 'Alertas sobre documentación pendiente';
      case 'CLIENTS': return 'Nuevos clientes y actualizaciones';
      case 'SYSTEM': return 'Mantenimiento y actualizaciones del sistema';
      default: return 'Notificaciones generales de la aplicación';
    }
  }

  private getChannelImportance(key: string): Importance {
    switch (key) {
      case 'VISITS': return Importance.HIGH;
      case 'DOCUMENTS': return Importance.HIGH;
      case 'SYSTEM': return Importance.HIGH;
      default: return Importance.DEFAULT;
    }
  }

  /**
   * Maneja las notificaciones recibidas
   */
  private handleNotification(notification: PushNotificationObject) {
    if (notification.userInteraction) {
      // El usuario tocó la notificación
      this.handleNotificationPress(notification);
    }
  }

  /**
   * Maneja el toque en una notificación
   */
  private handleNotificationPress(notification: PushNotificationObject) {
    const { data } = notification;
    
    if (!data) return;

    switch (data.type) {
      case 'property_visit':
        // Navegar a detalles de propiedad
        break;
      case 'document_pending':
        // Navegar a documentos
        break;
      case 'client_interested':
        // Navegar a cliente
        break;
      case 'timeline_update':
        // Navegar a timeline
        break;
      default:
        // Navegar al dashboard
        break;
    }
  }

  /**
   * Guarda el token de notificación
   */
  private async saveToken(token: string) {
    try {
      await AsyncStorage.setItem('push_notification_token', token);
      // Aquí también enviarías el token a tu backend
      // await this.sendTokenToBackend(token);
    } catch (error) {
      console.error('Error saving notification token:', error);
    }
  }

  /**
   * Muestra una notificación local inmediata
   */
  showNotification(config: NotificationConfig) {
    PushNotification.localNotification({
      channelId: config.channelId || this.notificationChannels.DEFAULT,
      title: config.title,
      message: config.message,
      userInfo: config.data,
      priority: config.priority || 'default',
      soundName: config.sound || 'default',
      vibrate: config.vibrate !== false,
      actions: config.actions?.map(action => ({
        title: action.title,
        icon: action.icon,
      })),
    });
  }

  /**
   * Agenda una notificación programada
   */
  scheduleNotification(scheduled: ScheduledNotification): string {
    const schedule: PushNotificationScheduleObject = {
      id: scheduled.id,
      date: scheduled.date,
      title: scheduled.config.title,
      message: scheduled.config.message,
      userInfo: scheduled.config.data,
      repeatType: scheduled.repeatType,
      channelId: scheduled.config.channelId || this.notificationChannels.DEFAULT,
    };

    PushNotification.localNotificationSchedule(schedule);
    return scheduled.id;
  }

  /**
   * Cancela una notificación programada
   */
  cancelNotification(id: string) {
    PushNotification.cancelLocalNotifications({ id });
  }

  /**
   * Cancela todas las notificaciones programadas
   */
  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  /**
   * Métodos específicos para tipos de notificaciones
   */

  // Notificación de nueva visita programada
  notifyVisitScheduled(propertyTitle: string, visitDate: Date, clientName: string) {
    this.showNotification({
      title: 'Visita Programada',
      message: `${clientName} visitará "${propertyTitle}" el ${visitDate.toLocaleDateString('es-AR')}`,
      channelId: this.notificationChannels.VISITS,
      priority: 'high',
      data: {
        type: 'property_visit',
        propertyTitle,
        visitDate: visitDate.toISOString(),
        clientName,
      },
    });
  }

  // Notificación de documentación pendiente
  notifyDocumentPending(documentType: string, propertyName: string) {
    this.showNotification({
      title: 'Documentación Pendiente',
      message: `Se requiere ${documentType} para "${propertyName}"`,
      channelId: this.notificationChannels.DOCUMENTS,
      priority: 'high',
      data: {
        type: 'document_pending',
        documentType,
        propertyName,
      },
    });
  }

  // Notificación de nuevo cliente interesado
  notifyNewInterestedClient(clientName: string, propertyTitle: string) {
    this.showNotification({
      title: 'Nuevo Cliente Interesado',
      message: `${clientName} está interesado en "${propertyTitle}"`,
      channelId: this.notificationChannels.CLIENTS,
      priority: 'high',
      data: {
        type: 'client_interested',
        clientName,
        propertyTitle,
      },
    });
  }

  // Notificación de actualización de timeline
  notifyTimelineUpdate(transactionTitle: string, stage: string) {
    this.showNotification({
      title: 'Actualización de Proceso',
      message: `${transactionTitle} ha avanzado a: ${stage}`,
      channelId: this.notificationChannels.DEFAULT,
      data: {
        type: 'timeline_update',
        transactionTitle,
        stage,
      },
    });
  }

  // Recordatorio de seguimiento
  scheduleFollowUpReminder(clientName: string, propertyName: string, date: Date) {
    const id = `follow_up_${Date.now()}`;
    this.scheduleNotification({
      id,
      date,
      config: {
        title: 'Recordatorio de Seguimiento',
        message: `Contactar a ${clientName} sobre "${propertyName}"`,
        channelId: this.notificationChannels.CLIENTS,
        priority: 'medium',
        data: {
          type: 'follow_up_reminder',
          clientName,
          propertyName,
        },
      },
    });
  }

  /**
   * Solicita permisos de notificación
   */
  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.requestPermissions((permissions) => {
        resolve(
          permissions.alert || 
          permissions.badge || 
          permissions.sound
        );
      });
    });
  }

  /**
   * Obtiene el token de notificación guardado
   */
  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('push_notification_token');
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  /**
   * Limpia el token de notificación
   */
  async clearToken() {
    try {
      await AsyncStorage.removeItem('push_notification_token');
    } catch (error) {
      console.error('Error clearing notification token:', error);
    }
  }
}

// Exportar instancia singleton
export const notificationService = new NotificationService();
