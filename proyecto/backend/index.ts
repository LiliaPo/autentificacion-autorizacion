import express, { Request, Response, Router, RequestHandler, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const router = Router();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Error Handler Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error en el servidor',
    message: err.message
  });
});

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody extends LoginBody {
  username: string;
}

const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !await bcryptjs.compare(password, user.password)) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, 'secret');
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    console.log('Datos recibidos:', req.body); // Log de datos recibidos
    const { email, password, username } = req.body;
    
    if (!email || !password || !username) {
      res.status(400).json({ 
        error: 'Todos los campos son requeridos',
        details: { email: !email, password: !password, username: !username }
      });
      return;
    }

    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('Conectado a la base de datos');

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      res.status(400).json({ error: 'El username ya está en uso' });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log('Password hasheado correctamente');

    const user = await prisma.user.create({
      data: { 
        email, 
        username, 
        password: hashedPassword, 
        role: 'USER' 
      }
    });
    console.log('Usuario creado:', { id: user.id, email: user.email });

    const token = jwt.sign({ userId: user.id }, 'secret');
    res.json({ token });
  } catch (error) {
    console.error('Error en registro:', error);
    next(error);
  } finally {
    await prisma.$disconnect();
  }
};

// Ruta por defecto
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Backend</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          a { color: blue; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>API funcionando</h1>
        <p><a href="/api/users">👉 Click aquí para ver usuarios registrados</a></p>
      </body>
    </html>
  `);
});

// Ruta para ver usuarios
app.get('/api/users', async (req, res) => {
  try {
    console.log('Intentando obtener usuarios...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('Usuarios encontrados:', users);
    
    // Enviar respuesta HTML en lugar de JSON
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Usuarios Registrados</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; }
            tr:hover { background-color: #f5f5f5; }
            .back-link { margin-bottom: 20px; display: block; }
          </style>
        </head>
        <body>
          <a href="/" class="back-link">← Volver</a>
          <h1>Usuarios Registrados</h1>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Fecha de Registro</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(user => `
                <tr>
                  <td>${user.username}</td>
                  <td>${user.email}</td>
                  <td>${user.role}</td>
                  <td>${new Date(user.createdAt).toLocaleString('es-ES')}</td>
                  <td>${user.id}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Rutas de auth
router.post('/login', loginHandler);
router.post('/register', registerHandler);

app.use('/api/auth', router);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
  console.log('Frontend corriendo en http://localhost:5173');
  console.log(`Para ver usuarios, visita: http://localhost:${PORT}/api/users`);
}); 