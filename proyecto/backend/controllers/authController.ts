import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody extends LoginBody {
  username: string;
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !await bcryptjs.compare(password, user.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: 'USER'
      }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}; 