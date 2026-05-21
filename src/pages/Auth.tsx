import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [mobile, setMobile] = useState('+01 46789 98126');
  const navigate = useNavigate();

  const handleRegister = () => {
    // Generate a unique 8-digit ID (format: XXXX XXXX)
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `${part1} ${part2}`;
    localStorage.setItem('generatedUserId', generatedId);
    navigate('/home');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-gradient)',
      color: 'var(--text-primary)',
      position: 'relative'
    }}>
      <div style={{ padding: '24px 12px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="animate-slide-up" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 12px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, margin: 0, lineHeight: 0.9, color: 'var(--text-primary)' }}>BIDI</h1>
          <h1 style={{ fontSize: '6rem', fontWeight: 900, margin: 0, lineHeight: 0.9, color: 'var(--text-primary)' }}>BET</h1>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Just Verify & Play</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '40px', maxWidth: '300px' }}>
          Experience the thrill of elite competitive gaming with Bidi Bet. Verify and start winning.
        </p>

        <div className="w-full" style={{ marginBottom: '24px', textAlign: 'left' }}>
          <div style={{
            position: 'relative',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            padding: '12px 16px'
          }}>
            <label style={{ position: 'absolute', top: '-10px', left: '12px', background: 'var(--modal-bg)', padding: '0 8px', fontSize: '0.75rem', color: 'var(--accent-orange)', fontWeight: 800, borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
              Mobile Number
            </label>
            <input 
              type="text" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                fontSize: '1.2rem',
                fontWeight: 600,
                outline: 'none',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '8px' }}>You will receive an OTP for Verification</p>
        </div>

        <div className="w-full flex items-center gap-2" style={{ marginBottom: '24px' }}>
          <input type="checkbox" id="age" style={{ width: '20px', height: '20px', accentColor: 'var(--accent-orange)' }} />
          <label htmlFor="age" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>I certify that I am 18 years years old</label>
        </div>

        <button 
          className="btn" 
          onClick={handleRegister}
          style={{ background: '#2B2B73', color: 'white' }}
        >
          Register
        </button>


      </div>
    </div>
  );
};

export default Auth;
