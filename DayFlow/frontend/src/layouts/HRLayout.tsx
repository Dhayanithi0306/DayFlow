
import { useAuth } from '../features/auth/AuthContext';

export const HRLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>HR Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}</p>
        </div>
        <button 
          onClick={logout}
          style={{ padding: '0.5rem 1rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          Sign Out
        </button>
      </header>
      
      <main>
        <div style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '1rem', border: '1px solid var(--card-border)' }}>
          <h2 style={{ marginBottom: '1rem' }}>Human Resources Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>This area is restricted to users with the HR role.</p>
        </div>
      </main>
    </div>
  );
};
