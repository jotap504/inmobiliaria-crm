# Estructura de la Aplicación Móvil (React Native)

## 📁 Estructura de Carpetas

```
src/mobile/
├── app/                          # Navegación principal
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── biometric-setup.tsx
│   ├── (tabs)/                   # Navegación por tabs
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── properties.tsx
│   │   ├── clients.tsx
│   │   ├── timeline.tsx
│   │   └── profile.tsx
│   ├── properties/               # Pantallas de propiedades
│   │   ├── [id].tsx
│   │   ├── add.tsx
│   │   ├── edit.tsx
│   │   └── import.tsx
│   ├── clients/                  # Pantallas de clientes
│   │   ├── [id].tsx
│   │   ├── add.tsx
│   │   └── edit.tsx
│   ├── transactions/             # Pantallas de transacciones
│   │   ├── [id].tsx
│   │   ├── timeline.tsx
│   │   └── documents.tsx
│   ├── reports/                  # Pantallas de reportes
│   │   ├── index.tsx
│   │   ├── generate.tsx
│   │   └── history.tsx
│   ├── settings/                 # Configuración
│   │   ├── index.tsx
│   │   ├── notifications.tsx
│   │   ├── taxes.tsx
│   │   └── account.tsx
│   └── _layout.tsx              # Layout principal
├── components/                   # Componentes compartidos
│   ├── ui/                      # Componentes UI base
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── timeline.tsx
│   ├── forms/                   # Componentes de formularios
│   │   ├── property-form.tsx
│   │   ├── client-form.tsx
│   │   └── document-upload.tsx
│   ├── lists/                   # Componentes de listas
│   │   ├── property-list.tsx
│   │   ├── client-list.tsx
│   │   └── transaction-list.tsx
│   └── charts/                  # Componentes de gráficos
│       ├── sales-chart.tsx
│       └── performance-chart.tsx
├── services/                    # Lógica de negocio
│   ├── auth.ts                  # Autenticación
│   ├── biometrics.ts            # Biometría
│   ├── notifications.ts         # Notificaciones push
│   ├── storage.ts              # Almacenamiento local
│   ├── camera.ts               # Cámara y fotos
│   ├── location.ts             # GPS y ubicación
│   └── sync.ts                 # Sincronización
├── hooks/                       # Hooks personalizados
│   ├── useAuth.ts
│   ├── useBiometrics.ts
│   ├── useNotifications.ts
│   ├── useCamera.ts
│   └── useLocation.ts
├── utils/                       # Utilidades
│   ├── constants.ts             # Constantes
│   ├── helpers.ts              # Funciones helper
│   ├── validators.ts            # Validaciones
│   └── formatters.ts           # Formateo de datos
├── store/                       # Estado global
│   ├── auth.ts
│   ├── properties.ts
│   ├── clients.ts
│   └── transactions.ts
└── navigation/                  # Configuración de navegación
    ├── types.ts
    └── linking.ts
```

## 🔧 Características Específicas Móviles

### Autenticación Biométrica
- Face ID (iOS)
- Touch ID (iOS)
- Huella Dactilar (Android)
- PIN como fallback

### Notificaciones Push
- Nuevos clientes interesados
- Recordatorios de visitas
- Alertas de documentación pendiente
- Actualizaciones de propiedades

### Funciones Nativas
- Cámara para documentación
- GPS para visitas
- Almacenamiento offline
- Sincronización automática

### Optimizaciones Móviles
- Lazy loading de componentes
- Cache inteligente
- Modo offline
- Gestión de memoria
