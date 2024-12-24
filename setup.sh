mkdir auth-app
cd auth-app

# Archivos de configuración en la raíz
echo "# Dependencies
node_modules

# Production
dist
build

# Environment variables
.env
.env.*.local

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.sw?

# TypeScript
*.tsbuildinfo

# Prisma
prisma/migrations/" > .gitignore

# Estructura básica
mkdir -p src/{backend,frontend}/{controllers,middleware,routes,schemas,api,components,context,pages}

# Inicializar proyecto
pnpm init
pnpm add express cors dotenv bcryptjs jsonwebtoken @prisma/client zod react react-dom @tanstack/react-query axios react-router-dom @headlessui/react @heroicons/react

# Dependencias de desarrollo
pnpm add -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/react @types/react-dom prisma ts-node nodemon tailwindcss postcss autoprefixer @vitejs/plugin-react concurrently

# Inicializar Prisma
pnpm prisma init 