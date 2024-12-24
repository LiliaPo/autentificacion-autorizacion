import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password,
        username
      });
      console.log('Registro exitoso:', response.data);
      navigate('/login');
    } catch (error: any) {
      console.error('Error detallado:', error.response?.data || error.message);
      alert('Error al registrarse: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto' }}>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '8px' }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '8px' }}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px' }}
          required
        />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>
          Registrarse
        </button>
      </form>
    </div>
  );
} 