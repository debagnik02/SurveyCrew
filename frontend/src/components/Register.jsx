import React, { useState } from 'react';
import './styles/register.css';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [registerStatus, setRegisterStatus] = useState(''); // New state for registration status message
  const[registerMessage,setRegisterMessage]=useState('');
  const navigate = useNavigate();
  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name) {
      errors.name = 'Name is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setRegisterStatus(''); // Clear register status on validation error
    } else {
      setErrors({});
      
      
      const response = await axios.post('http://localhost:3000/api/register', {fullName: name, email: email, phoneNumber: phone})
      if(response.data.registered){
        setRegisterStatus('success');
      }
      else{
        setRegisterStatus('failure');
        setRegisterMessage(response.data.message)
      }
      
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="logo">SurveyCrew</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'input-error' : ''}
              required
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? 'input-error' : ''}
              required
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>
          <button type="submit" className="register-button">Register</button>
          
          {/* Register Status Message */}
          {registerStatus === 'success' && <p className="success-text">Successfully registered! Check mail for credentials and <span className='register-link' onClick={()=>{navigate('/login')}}>login</span></p>}
          {registerStatus === 'failure' && <p className="failure-text">{registerMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
