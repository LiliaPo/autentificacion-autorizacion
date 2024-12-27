# Auth App - Sistema de Autenticación y Autorización

## Descripción
Esta aplicación es un sistema completo de autenticación y autorización que implementa las mejores prácticas de seguridad. Incluye registro de usuarios, inicio de sesión, y un panel de administración con diferentes niveles de acceso.

## Características Principales
- Registro de usuarios con validación de contraseña segura
- Inicio de sesión con JWT
- Panel de administración protegido
- Validación de formularios en tiempo real
- Interfaz de usuario moderna y responsive
- Manejo de errores robusto
- Protección de rutas basada en roles

## Tecnologías Utilizadas
- Frontend:
  - React con TypeScript
  - React Router para navegación
  - Axios para peticiones HTTP
  - CSS moderno para estilos

- Backend:
  - Node.js con Express
  - TypeScript
  - Prisma como ORM
  - JWT para autenticación
  - Bcrypt para encriptación de contraseñas
  - Zod para validación de datos

## Instalación

1. Clona el repositorio:git clone [url-del-repositorio]

2. Instala las dependencias:
```bash
npm install
```

3. Configura la base de datos:
```bash
npx prisma migrate dev
```

## Iniciar la Aplicación

Para iniciar tanto el backend como el frontend:
```bash
npm run dev
```

Esto iniciará:
- Backend en http://localhost:3001
- Frontend en http://localhost:5173

## Requisitos de Contraseña
La aplicación implementa los siguientes requisitos de seguridad para las contraseñas:
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial

## Estructura del Proyecto
```
proyecto/
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── context/
│   └── styles/
└── backend/
    ├── routes/
    ├── middleware/
    ├── schemas/
    └── prisma/
```

## Seguridad
- Contraseñas hasheadas con bcrypt
- Tokens JWT para sesiones
- Validación de datos con Zod
- Middleware de autenticación
- Protección contra XSS y CSRF
- Manejo seguro de errores

## Contribuir
Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.
