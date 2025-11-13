'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/useUserStore';
import { authApi } from '../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, initialize, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      try {
        const response = await authApi.getMe();
        setUser(response.user);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        logout();
        router.push('/login');
      }
    };

    fetchUserData();
  }, [isAuthenticated, router, logout, setUser]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
      router.push('/login');
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-4">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="btn-danger">
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '24px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h2>Welcome back, {user?.name}!</h2>
        <p style={{ margin: '8px 0', color: '#6b7280' }}>
          <strong>Email:</strong> {user?.email}
        </p>
        <p style={{ margin: '8px 0', color: '#6b7280' }}>
          <strong>Role:</strong> 
          <span style={{ 
            background: user?.role === 'ADMIN' ? '#ddd6fe' : '#dcfce7', 
            color: user?.role === 'ADMIN' ? '#7c3aed' : '#16a34a',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            marginLeft: '8px'
          }}>
            {user?.role}
          </span>
        </p>
      </div>

      <div className="mb-4">
        <h3>Quick Actions</h3>
        <div className="flex gap-2 flex-wrap" style={{ marginTop: '12px' }}>
          {user?.role === 'ADMIN' ? (
            <>
              <button 
                onClick={() => router.push('/users')}
                className="btn-primary"
              >
                👥 Manage Users
              </button>
              <button 
                onClick={() => alert('Admin settings coming soon!')}
                className="btn-secondary"
              >
                ⚙️ Admin Settings
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => alert('Profile editing coming soon!')}
                className="btn-secondary"
              >
                👤 Edit Profile
              </button>
              
              <button 
                onClick={() => alert('User settings coming soon!')}
                className="btn-secondary"
              >
                ⚙️ Settings
              </button>
            </>
          )}
        </div>
      </div>

      {user?.role === 'ADMIN' ? (
        <div style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea20, #764ba220)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3>🔐 Admin Panel</h3>
          <p style={{ color: '#6b7280', marginBottom: '12px' }}>You have administrator privileges. You can:</p>
          <ul style={{ color: '#6b7280', paddingLeft: '20px' }}>
            <li>View and manage all users in the system</li>
            <li>Create, edit, and delete user accounts</li>
            <li>Assign and modify user roles (USER/ADMIN)</li>
            <li>Monitor system activity</li>
          </ul>
          <div style={{ marginTop: '16px' }}>
            <button 
              onClick={() => router.push('/users')}
              className="btn-primary"
            >
              👥 Go to User Management
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px', background: 'linear-gradient(135deg, #16a34a20, #22c55e20)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3>👤 User Dashboard</h3>
          <p style={{ color: '#6b7280', marginBottom: '12px' }}>Welcome! As a user, you have access to:</p>
          <ul style={{ color: '#6b7280', paddingLeft: '20px' }}>
            <li>View your profile information</li>
            <li>Update your personal settings</li>
            <li>Access user-specific features</li>
            <li>Contact support if needed</li>
          </ul>
        </div>
      )}
    </div>
  );
}