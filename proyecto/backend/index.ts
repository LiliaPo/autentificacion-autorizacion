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
app.get('/api/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
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
            .button { 
              padding: 6px 12px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              margin-right: 5px;
            }
            .save { background: #28a745; color: white; }
            .delete { background: #dc3545; color: white; }
            input, select { 
              padding: 6px;
              border: 1px solid #ddd;
              border-radius: 4px;
              width: 90%;
            }
            .editing { background-color: #fff3cd; }
          </style>
          <script>
            async function deleteUser(id) {
              if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                try {
                  const response = await fetch(\`/api/users/\${id}\`, {
                    method: 'DELETE'
                  });
                  if (response.ok) {
                    location.reload();
                  } else {
                    alert('Error al eliminar usuario');
                  }
                } catch (error) {
                  console.error('Error:', error);
                  alert('Error al eliminar usuario');
                }
              }
            }

            async function saveUser(id, row) {
              try {
                const username = row.querySelector('.username-input').value;
                const email = row.querySelector('.email-input').value;
                const role = row.querySelector('.role-select').value;

                const response = await fetch(\`/api/users/\${id}\`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, email, role })
                });
                
                if (response.ok) {
                  location.reload();
                } else {
                  alert('Error al actualizar usuario');
                }
              } catch (error) {
                console.error('Error:', error);
                alert('Error al actualizar usuario');
              }
            }
          </script>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(user => `
                <tr id="row-${user.id}">
                  <td><input type="text" class="username-input" value="${user.username}" required></td>
                  <td><input type="email" class="email-input" value="${user.email}" required></td>
                  <td>
                    <select class="role-select">
                      <option value="USER" ${user.role === 'USER' ? 'selected' : ''}>USER</option>
                      <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                    </select>
                  </td>
                  <td>${new Date(user.createdAt).toLocaleString('es-ES')}</td>
                  <td>
                    <button onclick="saveUser('${user.id}', document.getElementById('row-${user.id}'))" class="button save">Guardar</button>
                    <button onclick="deleteUser('${user.id}')" class="button delete">Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

// Handlers con tipos específicos
interface UserParams { id: string }

const deleteUserHandler: RequestHandler<UserParams> = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'Usuario eliminado correctamente' });
    return;
  } catch (error) {
    next(error);
  }
};

const editUserFormHandler: RequestHandler<UserParams> = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      res.status(404).send('Usuario no encontrado');
      return;
    }
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Editar Usuario</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            input { width: 100%; padding: 8px; margin-bottom: 10px; }
            button { padding: 10px 15px; background: #007bff; color: white; border: none; cursor: pointer; }
            .back-link { display: block; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <a href="/api/users" class="back-link">← Volver a la lista</a>
          <h1>Editar Usuario</h1>
          <form id="editForm">
            <div class="form-group">
              <label>Username:</label>
              <input type="text" id="username" value="${user.username}" required>
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input type="email" id="email" value="${user.email}" required>
            </div>
            <button type="submit">Guardar Cambios</button>
          </form>

          <script>
            document.getElementById('editForm').onsubmit = async (e) => {
              e.preventDefault();
              try {
                const response = await fetch('/api/users/${user.id}', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: document.getElementById('username').value,
                    email: document.getElementById('email').value,
                  })
                });
                
                if (response.ok) {
                  window.location.href = '/api/users';
                } else {
                  alert('Error al actualizar usuario');
                }
              } catch (error) {
                console.error('Error:', error);
                alert('Error al actualizar usuario');
              }
            };
          </script>
        </body>
      </html>
    `);
    return;
  } catch (error) {
    next(error);
  }
};

const updateUserHandler: RequestHandler<UserParams> = async (req, res, next) => {
  try {
    const { username, email, role } = req.body;
    await prisma.user.update({
      where: { id: req.params.id },
      data: { username, email, role }
    });
    res.json({ message: 'Usuario actualizado correctamente' });
    return;
  } catch (error) {
    next(error);
  }
};

// Rutas de usuarios
const userRouter = Router();
userRouter.delete('/:id', deleteUserHandler);
userRouter.get('/edit/:id', editUserFormHandler);
userRouter.put('/:id', updateUserHandler);

// Montar los routers
app.use('/api/users', userRouter);
app.use('/api/auth', router);

// Rutas de auth
router.post('/login', loginHandler);
router.post('/register', registerHandler);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
  console.log('Frontend corriendo en http://localhost:5173');
  console.log(`Para ver usuarios, visita: http://localhost:${PORT}/api/users`);
}); 