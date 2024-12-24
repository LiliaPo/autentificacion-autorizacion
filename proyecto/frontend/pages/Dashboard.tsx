import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get<User[]>('http://localhost:3000/api/users');
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Usuarios Registrados</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 