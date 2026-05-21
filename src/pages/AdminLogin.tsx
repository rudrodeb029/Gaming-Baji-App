import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = 'admin123';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid password. Access denied.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="admin-layout" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0C14 0%, #1A1C2E 50%, #0A0C14 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,111,46,0.08) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '15%', width: '400px', height: '400px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,67,96,0.06) 0%, transparent 70%)',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '32px',
        padding: '56px 48px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo / Icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'linear-gradient(135deg, #F96F2E, #E34360)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 12px 32px rgba(249,111,46,0.3)',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        <h1 style={{
          textAlign: 'center', color: '#FFFFFF', fontSize: '2rem',
          fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em',
        }}>
          Admin <span style={{ background: 'linear-gradient(90deg, #F96F2E, #E34360)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portal</span>
        </h1>
        <p style={{
          textAlign: 'center', color: '#9CA3AF', fontSize: '0.95rem',
          marginBottom: '40px', fontWeight: 500,
        }}>
          Enter your admin credentials to continue
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{
                  width: '100%', padding: '18px 20px', paddingLeft: '52px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `2px solid ${error ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '16px', color: '#FFFFFF',
                  fontFamily: "'Outfit', sans-serif", fontSize: '1rem',
                  outline: 'none', transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = '#F96F2E'; }}
                onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px', padding: '14px 18px', marginBottom: '24px',
              color: '#EF4444', fontSize: '0.9rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%', padding: '20px',
              background: loading || !password ? 'rgba(255,255,255,0.05)' : 'linear-gradient(90deg, #F96F2E, #E34360)',
              color: loading || !password ? '#6B7280' : '#FFFFFF',
              border: loading || !password ? '1px solid rgba(255,255,255,0.1)' : 'none',
              borderRadius: '16px', fontSize: '1.1rem', fontWeight: 800,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              boxShadow: loading || !password ? 'none' : '0 12px 32px rgba(249,111,46,0.35)',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Authenticating...
              </span>
            ) : 'Access Dashboard'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', color: '#4B5563', fontSize: '0.8rem',
          marginTop: '32px', fontWeight: 500,
        }}>
          🔒 Secured Admin Access Only
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
