import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const { password } = formData;
    setRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password)
    });
  }, [formData.password]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!Object.values(requirements).every(Boolean)) {
      setError('La contraseña debe cumplir todos los requisitos');
      return;
    }

    try {
      const response = await axios.post<RegisterResponse>('http://localhost:3001/api/auth/register', formData);
      login(response.data.token, response.data.user.id);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al registrarse');
    }
  };

  const renderRequirement = (key: keyof typeof requirements, text: string) => (
    <div className={`requirement ${requirements[key] ? 'valid' : 'invalid'}`}>
      {text}
    </div>
  );

  return (
    <div className="auth-container">
      <h1 className="auth-title">Registro</h1>
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="password-requirements">
            {renderRequirement('minLength', 'Mínimo 8 caracteres')}
            {renderRequirement('hasUppercase', 'Al menos una mayúscula')}
            {renderRequirement('hasLowercase', 'Al menos una minúscula')}
            {renderRequirement('hasNumber', 'Al menos un número')}
            {renderRequirement('hasSpecial', 'Al menos un carácter especial (!@#$%^&*)')}
          </div>
        </div>

        <button type="submit" className="button save">
          Registrarse
        </button>
      </form>

      <Link to="/login" className="auth-link">
        ¿Ya tienes cuenta? &nbsp;Inicia sesión
      </Link>
    </div>
  );
} 
 