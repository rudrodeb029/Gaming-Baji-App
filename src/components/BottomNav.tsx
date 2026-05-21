import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, FileText, Activity, User, Wallet } from 'lucide-react';
import { useBalance } from '../context/BalanceContext';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = () => {
  const location = useLocation();
  const { balance } = useBalance();
  const { t } = useLanguage();

  const navItems = [
    { path: '/home', icon: HomeIcon, label: t('home') },
    { path: '/wallet', icon: Wallet, label: t('wallet'), showBalance: true },
    { path: '/my-bets', icon: Activity, label: t('myBets') },
    { path: '/profile', icon: User, label: t('profile') }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--bg-dark)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '4px 0 6px',
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      zIndex: 50,
      maxWidth: '480px',
      margin: '0 auto',
      borderTop: '1px solid var(--glass-border)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: 'var(--nav-shadow)'
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link 
            key={item.path} 
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: isActive ? 'var(--accent-orange)' : 'var(--text-secondary)',
              gap: '6px',
              position: 'relative',
              flex: 1,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px'
            }}>
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2}
                style={{ 
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(249, 111, 46, 0.4))' : 'none'
                }} 
              />
              {item.showBalance && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-18px',
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  fontSize: '0.6rem',
                  fontWeight: 900,
                  padding: '2px 6px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--bg-dark)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                  ${Math.floor(balance)}
                </div>
              )}
            </div>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: isActive ? 800 : 600,
              letterSpacing: '0.01em'
            }}>{item.label}</span>
            {isActive && (
              <div 
                className="animate-fade-in"
                style={{ 
                  width: '12px', 
                  height: '3px', 
                  borderRadius: '10px', 
                  background: 'var(--accent-orange)', 
                  marginTop: '2px',
                  boxShadow: '0 0 8px var(--accent-orange)'
                }} 
              />
            )}
          </Link>
        )
      })}
    </div>
  );
};

export default BottomNav;
