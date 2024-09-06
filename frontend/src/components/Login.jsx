import React, { useState } from 'react';
import './styles/login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoginStatus('');
    } else {
      setErrors({});
      try {
        const response = await axios.post(
          'http://localhost:3000/api/loginCheck',
          { email: email, password: password },
          { withCredentials: true }
        );
        console.log(response.data);

        if (response.data.auth) {
          setLoginStatus('success');
          localStorage.setItem('user', JSON.stringify({ name: response.data.name, email: response.data.email }));
          navigate('/')
        } else {
          setLoginStatus('failure');
        }
      } catch (error) {
        console.error('Login failed:', error);
        setLoginStatus('failure');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">SurveyCrew</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'input-error' : ''}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'input-error' : ''}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <button type="submit" className="login-button">Login</button>

          {loginStatus === 'success' && <p className="success-text">Successfully logged in!</p>}
          {loginStatus === 'failure' && <p className="failure-text">Failed to log in. Please check your credentials.</p>}
        </form>

        {/* Note with link to register */}
        <p className="register-note">
          Don’t have an account?{' '}
          <span className="register-link" onClick={() => navigate('/register')}>
            Register instead
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
