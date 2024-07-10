import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigate('/calls');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '200px' }}>
      <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-center mb-4">Login</h1>
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group mb-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin} className="btn btn-primary w-100">Login</button>
      </div>
    </div>
  );
};

export default Login;
