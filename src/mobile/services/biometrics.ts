import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import { Alert, Platform } from 'react-native';

export interface BiometricConfig {
  allowDeviceCredentials: boolean;
  biometricStrength: 'weak' | 'medium' | 'strong';
  title: string;
  subtitle?: string;
  description?: string;
}

export class BiometricService {
  private rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  /**
   * Verifica si el dispositivo tiene capacidades biométricas
   */
  async isBiometricAvailable(): Promise<{
    available: boolean;
    biometryType?: BiometryTypes;
    details: string;
  }> {
    try {
      const { available, biometryType } = await this.rnBiometrics.isSensorAvailable();
      
      let details = '';
      if (available) {
        switch (biometryType) {
          case BiometryTypes.TouchID:
            details = 'Touch ID disponible';
            break;
          case BiometryTypes.FaceID:
            details = 'Face ID disponible';
            break;
          case BiometryTypes.Biometrics:
            details = 'Huella dactilar disponible';
            break;
          default:
            details = 'Biométrica disponible';
        }
      } else {
        details = 'No hay autenticación biométrica disponible';
      }

      return { available, biometryType, details };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return { 
        available: false, 
        details: 'Error al verificar disponibilidad biométrica' 
      };
    }
  }

  /**
   * Registra las credenciales biométricas del usuario
   */
  async registerBiometrics(userId: string, email: string): Promise<boolean> {
    try {
      // Verificar disponibilidad primero
      const { available } = await this.isBiometricAvailable();
      if (!available) {
        throw new Error('Biometría no disponible en este dispositivo');
      }

      // Crear llave pública para el usuario
      const { publicKey } = await this.rnBiometrics.createKeys();
      
      // Guardar credenciales en Keychain
      const credentials = {
        userId,
        email,
        publicKey,
        registeredAt: new Date().toISOString(),
      };

      await Keychain.setInternetCredentials(
        `biometric_${userId}`,
        'biometric_credentials',
        JSON.stringify(credentials)
      );

      return true;
    } catch (error) {
      console.error('Error registering biometrics:', error);
      throw error;
    }
  }

  /**
   * Autentica al usuario usando biometría
   */
  async authenticateWithBiometrics(config?: Partial<BiometricConfig>): Promise<{
    success: boolean;
    userId?: string;
    credentials?: any;
  }> {
    try {
      const { available, biometryType } = await this.isBiometricAvailable();
      
      if (!available) {
        return { success: false };
      }

      // Configurar mensaje según tipo de biometría
      let title = 'Autenticación requerida';
      let subtitle = '';
      
      switch (biometryType) {
        case BiometryTypes.TouchID:
          title = 'Usar Touch ID';
          subtitle = 'Coloca tu dedo en el sensor';
          break;
        case BiometryTypes.FaceID:
          title = 'Usar Face ID';
          subtitle = 'Mira tu dispositivo';
          break;
        case BiometryTypes.Biometrics:
          title = 'Usar Huella Dactilar';
          subtitle = 'Coloca tu dedo en el sensor';
          break;
      }

      // Realizar autenticación
      const { success } = await this.rnBiometrics.simplePrompt({
        promptMessage: config?.title || title,
        cancelButtonText: 'Cancelar',
      });

      if (success) {
        // Obtener credenciales guardadas
        const credentials = await this.getStoredCredentials();
        return { 
          success: true, 
          userId: credentials?.userId,
          credentials 
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return { success: false };
    }
  }

  /**
   * Obtiene las credenciales almacenadas
   */
  async getStoredCredentials(): Promise<any | null> {
    try {
      const credentials = await Keychain.getInternetCredentials('biometric_credentials');
      if (credentials && typeof credentials === 'object' && 'password' in credentials) {
        return JSON.parse(credentials.password);
      }
      return null;
    } catch (error) {
      console.error('Error getting stored credentials:', error);
      return null;
    }
  }

  /**
   * Elimina las credenciales biométricas
   */
  async removeBiometricCredentials(userId: string): Promise<boolean> {
    try {
      await Keychain.resetInternetCredentials(`biometric_${userId}`);
      return true;
    } catch (error) {
      console.error('Error removing biometric credentials:', error);
      return false;
    }
  }

  /**
   * Verifica si el usuario ya tiene biometría configurada
   */
  async isBiometricConfigured(userId: string): Promise<boolean> {
    try {
      const credentials = await Keychain.getInternetCredentials(`biometric_${userId}`);
      return credentials !== false;
    } catch (error) {
      console.error('Error checking biometric configuration:', error);
      return false;
    }
  }

  /**
   * Obtiene información del dispositivo para UI
   */
  getDeviceInfo() {
    return {
      platform: Platform.OS,
      version: Platform.Version,
      isIOS: Platform.OS === 'ios',
      isAndroid: Platform.OS === 'android',
    };
  }

  /**
   * Muestra alerta de configuración biométrica
   */
  showBiometricSetupAlert(onSetup: () => void, onSkip: () => void) {
    Alert.alert(
      'Configurar Autenticación Biométrica',
      '¿Deseas configurar Face ID/Touch ID para acceso rápido y seguro?',
      [
        {
          text: 'Ahora no',
          onPress: onSkip,
          style: 'cancel',
        },
        {
          text: 'Configurar',
          onPress: onSetup,
        },
      ]
    );
  }
}

// Exportar instancia singleton
export const biometricService = new BiometricService();
