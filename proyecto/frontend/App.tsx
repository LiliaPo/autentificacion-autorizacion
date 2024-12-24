import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

export function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
          <Link to="/login" style={{ marginRight: '20px' }}>Login</Link>
          <Link to="/register">Registro</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
} 