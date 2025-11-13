'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../lib/api';
import { useUserStore } from '../store/useUserStore';

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setToken, isAuthenticated, initialize } = useUserStore();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' as 'USER' | 'ADMIN' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initialize();
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, initialize, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      const response = await authApi.signup(formData);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      router.push('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="text-center">Create Account</h1>
        <p className="text-center" style={{ color: '#6b7280', marginBottom: '24px' }}>Join us today</p>
        
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="mb-4">
            <label>Account Type</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'ADMIN' })}
            >
              <option value="USER">👤 User Account</option>
              <option value="ADMIN">👑 Admin Account</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center mt-4">
          Already have an account?{' '}
          <a href="/login">Sign in here</a>
        </p>
      </div>
    </div>
  );
}