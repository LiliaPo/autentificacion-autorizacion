import { Router } from 'express';
import { protect, restrictTo } from '../middleware/authGuard';

const router = Router();

router.get('/profile', protect, (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

router.get('/admin', protect, restrictTo('ADMIN'), (req, res) => {
  res.json({
    status: 'success',
    message: 'Ruta solo para administradores',
  });
});

export { router as protectedRouter }; 