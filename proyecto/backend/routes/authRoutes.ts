import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { authGuard } from '../middleware/authGuard';

const router = Router();

// Rutas públicas
router.post('/login', login);
router.post('/register', register);

// Ruta protegida de ejemplo
router.get('/me', authGuard, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, username: true, role: true }
    });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router; 