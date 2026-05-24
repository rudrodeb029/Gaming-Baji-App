import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../data/mockData';
import { useBalance } from '../context/BalanceContext';
import { useAdmin } from '../context/AdminContext';
import { useCurrency } from '../context/CurrencyContext';
import { useChat } from '../context/ChatContext';


interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const navigate = useNavigate();
  const { balance } = useBalance();
  const { isAdminMode, toggleAdminMode } = useAdmin();
  const { formatCurrency } = useCurrency();
  const { setIsChatOpen } = useChat();
  
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 200,
      display: 'flex',
    }} onClick={onClose}>
      <div 
        className="animate-fade-in"
        style={{
          width: '80%',
          maxWidth: '300px',
          height: '100%',
          background: 'var(--bg-dark)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--card-shadow)',
          borderRight: '1px solid var(--glass-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          onClick={() => { navigate('/profile'); onClose(); }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '40px', 
            cursor: 'pointer',
            padding: '12px',
            borderRadius: '20px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)'
          }}
        >
          <div style={{ width: '52px', height: '52px', borderRadius: '18px', overflow: 'hidden', border: '2px solid var(--accent-orange)', boxShadow: '0 0 15px rgba(249, 111, 46, 0.2)' }}>
            <img src={currentUser.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{currentUser.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{currentUser.username}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button onClick={() => { navigate('/home'); onClose(); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600, padding: '14px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '16px', transition: 'background 0.2s' }} className="menu-item-hover">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Home
          </button>
          
          <button onClick={() => { navigate('/wallet'); onClose(); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600, padding: '14px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderRadius: '16px', transition: 'background 0.2s' }} className="menu-item-hover">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              Wallet
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', fontWeight: 800, background: 'rgba(249, 111, 46, 0.1)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(249, 111, 46, 0.2)' }}>
              {formatCurrency(balance)}
            </span>
          </button>

          <button onClick={() => { navigate('/my-bets'); onClose(); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600, padding: '14px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '16px', transition: 'background 0.2s' }} className="menu-item-hover">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            My Bets
          </button>

          <button onClick={() => { navigate('/support'); onClose(); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600, padding: '14px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '16px', transition: 'background 0.2s' }} className="menu-item-hover">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Support
          </button>

          <div style={{ margin: '20px 0', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', paddingLeft: '12px' }}>Developer Settings</div>
            <button 
              onClick={() => { toggleAdminMode(); onClose(); }} 
              style={{ 
                textAlign: 'left', 
                background: isAdminMode ? 'rgba(249, 111, 46, 0.1)' : 'none', 
                border: '1px solid',
                borderColor: isAdminMode ? 'var(--accent-orange)' : 'transparent',
                color: isAdminMode ? 'var(--accent-orange)' : 'var(--text-primary)', 
                fontSize: '1.05rem', 
                fontWeight: 600, 
                padding: '14px 12px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                borderRadius: '16px', 
                width: '100%',
                transition: 'all 0.2s',
                marginBottom: '8px'
              }} 
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              {isAdminMode ? 'Disable Admin Mode' : 'Enable Admin Mode'}
            </button>

            {isAdminMode && (
              <button 
                onClick={() => {
                  if (window.confirm('Reset all demo data to default?')) {
                    localStorage.removeItem('localMatches');
                    localStorage.removeItem('localWinners');
                    localStorage.removeItem('localParticipants');
                    localStorage.removeItem('customStats');
                    localStorage.removeItem('localGateways');
                    localStorage.removeItem('savedMethods');
                    window.location.reload();
                  }
                }} 
                style={{ 
                  textAlign: 'left', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#EF4444', 
                  fontSize: '1rem', 
                  fontWeight: 600, 
                  padding: '12px 12px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  borderRadius: '16px', 
                  width: '100%',
                  transition: 'all 0.2s' 
                }} 
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Reset App Data
              </button>
            )}
          </div>
        </div>

        <button onClick={() => { navigate('/auth'); onClose(); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#EF4444', fontSize: '1.1rem', fontWeight: 600, padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
