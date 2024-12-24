import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      alert('Login exitoso!');
    } catch (error) {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto' }}>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
} 