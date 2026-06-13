import React, { useState } from 'react';
import classes from './index.module.css';
import { useNavigate } from 'react-router-dom'; 
const apiUrl = import.meta.env.VITE_API_URL;
const Index = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerHandler = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    console.log("Form Data:", formData);

    try {
      const response = await fetch(`${apiUrl}/api/users`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'any-value',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        }),
      });
      
      const token = response.headers.get('Authorization')?.split(' ')[1];
      console.log(token);
      if (token) {
        localStorage.setItem('auth_token', token); 
      }

      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.msg || data.message || data.error || "Something went wrong");
      }

      console.log("User registered successfully:", data);
      navigate('/');
    } catch (err) {
      setLoading(false);
      alert(`Error: ${err.message}`);
      console.error("Error registering user:", err);
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

  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>Register</h1>
      <form onSubmit={registerHandler} className={classes.form}>
        <input
          type="text"
          id="name"
          placeholder="name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />

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
          value={loading ? "Registering..." : "Register"} 
          disabled={loading} 
        />
      </form>
    </div>
  );
};

export default Index;
