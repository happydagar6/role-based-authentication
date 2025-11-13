'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from './store/useUserStore';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, initialize } = useUserStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="page-container">
      <div className="container text-center">
        <h1>🔐 Role Auth App</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Simple and secure role-based authentication
        </p>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #f3f3f3', 
          borderTop: '3px solid #3b82f6', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '14px' }}>
          Redirecting...
        </p>
      </div>
    </div>
  );
}
