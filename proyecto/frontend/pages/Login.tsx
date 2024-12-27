import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface LoginResponse {
  token: string;
  user: {
    id: string;
  };
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>('http://localhost:3001/api/auth/login', {
        email,
        password
      });
      login(response.data.token, response.data.user.id);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Iniciar Sesión</h1>
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="button save">
          Iniciar Sesión
        </button>
      </form>

      <Link to="/register" className="auth-link">
        ¿No tienes cuenta? &nbsp;Regístrate
      </Link>
    </div>
  );
} 