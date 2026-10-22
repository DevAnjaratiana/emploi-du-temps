import { useEffect } from 'react';
import { API_URL, getCurrentUser } from '../api/auth';

export default function AdminRedirect() {
  const user = getCurrentUser();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = `${API_URL}/admin/`;
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '450px'
      }}>
        <h2 style={{ color: '#1e3a8a', marginBottom: '16px' }}>
          Redirection vers l'administration Django
        </h2>
        <p style={{ color: '#4b5563', marginBottom: '8px' }}>
          Bonjour <strong>{user?.username}</strong>
        </p>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
          Vous allez être redirigé dans un instant...
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
          ⚠️ Django vous demandera de vous reconnecter (système de session séparé).
        </p>
        <a
          href={`${API_URL}/admin/`}
          style={{ color: '#1e40af', textDecoration: 'underline', fontSize: '14px' }}
        >
          Cliquer ici si la redirection ne fonctionne pas
        </a>
      </div>
    </div>
  );
}