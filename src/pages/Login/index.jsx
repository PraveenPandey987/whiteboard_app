import React from 'react'
import classes from './index.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
const Index = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginHandler = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    console.log("Form Data:", formData);

    try {
      const headers = {
        'ngrok-skip-browser-warning': 'any-value',
        'Content-Type': 'application/json',
      };

      const auth_token = localStorage.getItem('auth_token');
      if (auth_token) {
        headers['Authorization'] = `Bearer ${auth_token}`;
        headers['ngrok-skip-browser-warning'] = 'any-value';
      }

      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      const newToken = response.headers.get('Authorization')?.split(' ')[1];
      if (newToken) {
        localStorage.setItem('auth_token', newToken);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("User logged in successfully:", data);
      navigate('/');
    } catch (err) {
      setLoading(false);
      alert(err.message);
      console.error("Error:", err.message);
    }
  };

  const handleChange = (e) => {
    const { id } = e.target;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const registerHandler = () => {
    navigate('/register');
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>Login</h1>
      <form onSubmit={loginHandler} className={classes.form}>
        <input
          type="email"
          id="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />

        <input
          type="password"
          id="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />

        <input 
          type="submit" 
          value={loading ? "Logging in..." : "Login"} 
          disabled={loading} 
        />
      </form>

      <button 
        style={{ backgroundColor: "red" }} 
        onClick={registerHandler}
        disabled={loading}
      >
        Sign Up
      </button>
    </div>
  );
};
  export default Index;