'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/useUserStore';
import { usersApi, User } from '../lib/api';

export default function UsersPage() {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersApi.getUsers(1, 100, search, roleFilter);
      setUsers(response.users);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetchUsers();
  }, [isAuthenticated, user, router, fetchUsers]);

  const handleSave = async () => {
    // Validate form data
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }
    
    if (!selectedUser && !formData.password.trim()) {
      setError('Password is required for new users');
      return;
    }

    try {
      if (selectedUser) {
        const updateData: Record<string, string> = { name: formData.name.trim(), email: formData.email.trim(), role: formData.role };
        if (formData.password.trim()) updateData.password = formData.password;
        await usersApi.updateUser(selectedUser.id, updateData as { name: string; email: string; role: 'USER' | 'ADMIN'; password?: string });
        setSuccess('User updated successfully');
      } else {
        await usersApi.createUser({ 
          name: formData.name.trim(), 
          email: formData.email.trim(), 
          password: formData.password, 
          role: formData.role as 'USER' | 'ADMIN' 
        });
        setSuccess('User created successfully');
      }
      setShowModal(false);
      fetchUsers();
      setFormData({ name: '', email: '', password: '', role: 'USER' });
      setSelectedUser(null);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete user?')) return;
    try {
      await usersApi.deleteUser(userId);
      setSuccess('User deleted');
      fetchUsers();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
  };

  const openModal = (userData?: User) => {
    if (userData) {
      setSelectedUser(userData);
      setFormData({ name: userData.name, email: userData.email, password: '', role: userData.role });
    } else {
      setSelectedUser(null);
      setFormData({ name: '', email: '', password: '', role: 'USER' });
    }
    setShowModal(true);
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="dashboard-container text-center" style={{ paddingTop: '100px' }}>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '24px', maxWidth: '400px', margin: '0 auto' }}>
          <h2 style={{ color: '#dc2626' }}>🚫 Access Denied</h2>
          <p style={{ color: '#6b7280', margin: '12px 0' }}>
            You need <strong>ADMIN</strong> privileges to access user management.
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
            Current role: <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px' }}>{user?.role || 'Not logged in'}</span>
          </p>
          <button onClick={() => router.push('/dashboard')} className="btn-primary">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1>👥 User Management</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Manage all users in the system</p>
        </div>
        <button onClick={() => router.push('/dashboard')} className="btn-secondary">
          ← Dashboard
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error} <button onClick={() => setError('')}>×</button>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success} <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
        <div className="flex gap-4 flex-wrap items-center justify-between">
          <div className="flex gap-2" style={{ flex: '1' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ paddingLeft: '36px', width: '100%' }}
              />
            </div>
            
            <select value={roleFilter} onChange={(e) => handleRoleFilter(e.target.value)} style={{ minWidth: '120px' }}>
              <option value="">All Roles</option>
              <option value="USER">👤 User</option>
              <option value="ADMIN">👑 Admin</option>
            </select>
          </div>
          
          <button onClick={() => openModal()} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            ➕ Add User
          </button>
        </div>
        
        <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
          Showing {users.length} user{users.length !== 1 ? 's' : ''}
          {(search || roleFilter) && (
            <button onClick={() => { setSearch(''); setRoleFilter(''); }} style={{ marginLeft: '8px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center" style={{ padding: '40px' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #f3f3f3', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '12px', color: '#6b7280' }}>Loading users...</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500' }}>{u.name}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{u.email}</div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      background: u.role === 'ADMIN' ? '#ddd6fe' : '#dcfce7',
                      color: u.role === 'ADMIN' ? '#7c3aed' : '#16a34a',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: '#6b7280', fontSize: '14px' }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openModal(u)}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                        className="btn-secondary"
                      >
                        ✏️ Edit
                      </button>
                      {user?.id !== u.id && (
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="btn-danger"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedUser ? '✏️ Edit User' : '➕ Add User'}</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="mb-4">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label>Password {selectedUser && '(leave empty to keep current)'}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={selectedUser ? "New password (optional)" : "Enter password"}
                />
              </div>
              
              <div className="mb-4">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: '1' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: '1' }}>
                  {selectedUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}