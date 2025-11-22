// src/components/Login.js
import React, { useState } from 'react';
import { authenticateUser, saveSession } from '../services/authService';
import { DEPARTMENTS } from '../utils/validations';
import '../styles/Login.css';

const Login = ({ onLoginSuccess }) => {
  const [department, setDepartment] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!department || !code) {
      setError('Por favor complete todos los campos');
      setLoading(false);
      return;
    }

    const result = await authenticateUser(department, code);
    
    if (result.success) {
      saveSession(result.user);
      onLoginSuccess(result.user);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Torre Azzaro II</h1>
          <p>Sistema de Reservas</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="department">Departamento</label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={loading}
            >
              <option value="">Seleccione su departamento</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="code">Código de Acceso</label>
            <input
              type="password"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingrese su código"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-footer">
          <p>¿Olvidó su código? Contacte al administrador</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
