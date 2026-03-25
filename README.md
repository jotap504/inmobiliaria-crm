# Cosentino Century21

Sistema completo de gestión para brokers inmobiliarios en Argentina con seguimiento de procesos de venta, gestión documental y automatización.

## 🚀 Características Principales

- **Timeline Visual Interactiva** del proceso de venta
- **Gestión Documental Centralizada** con generación IA de contratos
- **Calculadora de Impuestos** configurable para Argentina
- **Importación Masiva** de propiedades (Excel/APIs)
- **Reportes Automáticos** personalizables
- **Aplicación Móvil Nativa** (iOS/Android)
- **Autenticación Biométrica** y notificaciones push

## 🛠 Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Mobile**: React Native + Expo
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **IA**: OpenAI API para generación de documentos
- **Estilos**: shadcn/ui + Lucide icons

## 📋 Proceso de Venta Argentina

1. Contacto Inicial
2. Carga Documentación Vendedor
3. Publicación y Marketing
4. Visitas Coordinadas
5. Interesados Calificados
6. Negociación y Oferta
7. Boleto de Compra-Venta
8. Documentación Comprador
9. Escrituración
10. Post-Venta

## 🏗️ Estructura del Proyecto

```
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # Componentes reutilizables
│   ├── lib/                # Utilidades y configuración
│   ├── types/              # Tipos TypeScript
│   └── mobile/             # Código React Native compartido
├── supabase/               # Migraciones y funciones
└── docs/                   # Documentación
```

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar Supabase
cp .env.example .env.local
# Agregar tus variables de Supabase

# Iniciar desarrollo web
npm run dev

# Iniciar desarrollo móvil
npm run mobile
```

## 📱 Móvil

La aplicación móvil comparte el mismo código base que la web, con acceso a:
- Autenticación biométrica (Face ID/Touch ID/Huella)
- Notificaciones push
- Cámara para documentación
- GPS para visitas

## 🧾 Impuestos Configurables

- Impuesto de Sellos
- Gastos Administrativos
- Honorarios Escribano
- Comisión Inmobiliaria
- ITI (por provincia)
- Personalizables por jurisdicción

## 📊 Reportes Automáticos

- Ventas del período
- Pipeline de oportunidades
- Performance de agentes
- Estado documentación
- Métricas de propiedades

## 🏠 Importación de Propiedades

- Archivos Excel/CSV
- APIs de portales (ZonaProp, Mercado Libre)
- Sincronización automática
- Validación de datos

## 🔐 Seguridad

- Autenticación multinivel
- Auditoría completa
- Roles y permisos
- Firma digital legal

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles
