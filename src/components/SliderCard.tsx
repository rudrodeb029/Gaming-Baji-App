import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface SliderCardProps {
  group: string;
  players: string;
  team1: { name: string; logo: string; percentage: string; color: string };
  team2: { name: string; logo: string; percentage: string; color: string };
  score: string;
  time: string;
  bids: string[];
  totalBids: string;
  currentParticipants: number;
  maxParticipants: number;
  status: 'upcoming' | 'live' | 'finished';
  name: string;
  onClick?: () => void;
  isAdminMode?: boolean;
  onEdit?: () => void;
  liveStartedAt?: number;
}

const SliderCard = ({ group, players, team1, team2, score, time, bids, totalBids, currentParticipants, maxParticipants, onClick, isAdminMode, onEdit, status, name, liveStartedAt }: SliderCardProps) => {
  const { t } = useLanguage();
  const isLive = status === 'live';
  const [now, setNow] = useState(Date.now());

  // Tick every second for live and upcoming timers
  useEffect(() => {
    if (status === 'finished') return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [status]);

  const getElapsedTime = () => {
    if (!liveStartedAt) return '00:00:00';
    const elapsed = Math.max(0, Math.floor((now - liveStartedAt) / 1000));
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getUpcomingCountdown = () => {
    try {
      const trimmedTime = time.trim();
      // Support both 12h (10:00 PM) and 24h (21:00) formats
      const match12 = trimmedTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      const match24 = trimmedTime.match(/(\d{1,2}):(\d{2})/);
      
      let targetH = 0, targetM = 0;
      
      if (match12) {
        let [_, hours, mins, ampm] = match12;
        targetH = parseInt(hours);
        targetM = parseInt(mins);
        if (ampm.toUpperCase() === 'PM' && targetH < 12) targetH += 12;
        if (ampm.toUpperCase() === 'AM' && targetH === 12) targetH = 0;
      } else if (match24) {
        targetH = parseInt(match24[1]);
        targetM = parseInt(match24[2]);
      } else {
        return time;
      }
      
      const target = new Date();
      target.setHours(targetH, targetM, 0, 0);
      
      if (target.getTime() < Date.now()) {
        target.setDate(target.getDate() + 1);
      }
      
      const diff = Math.max(0, Math.floor((target.getTime() - now) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    } catch {
      return time;
    }
  };

  const isFull = currentParticipants >= maxParticipants;
  const progress = (currentParticipants / maxParticipants) * 100;

  // Modern SVG Icons
  const Icons = {
    Solo: (color: string) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    Duo: (color: string) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    Squad: (color: string) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    Gun: (color: string) => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${color}44)` }}>
        <path d="M10 5.17l-1.42 1.41-1.41-1.41L10 2.34l2.83 2.83-1.41 1.41L10 5.17zM5.64 8l-1.42 1.41-1.41-1.41L5.64 5.17l2.83 2.83-1.41 1.41L5.64 8zM21 11.5a.5.5 0 0 0-.5-.5h-7V9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2h6.5a.5.5 0 0 0 .5-.5v-1.5zM12 14H4v-4h8v4z"/>
        <path d="M14 11h2v2h-2zM18 11h2v2h-2z" fill={color} />
      </svg>
    )
  };

  // Mode-specific styling
  const getModeStyles = () => {
    if (group.toLowerCase().includes('solo')) {
      const color = '#FBBF24';
      return { 
        color, 
        bg: 'rgba(251, 191, 36, 0.1)', 
        instruction: t('soloInstruction'),
        icon: '👤',
        svgIcon: Icons.Solo(color)
      };
    }
    if (group.toLowerCase().includes('duo') || group.toLowerCase().includes('dot')) {
      const color = '#38BDF8';
      return { 
        color, 
        bg: 'rgba(56, 189, 248, 0.1)', 
        instruction: t('duoInstruction'),
        icon: '👥',
        svgIcon: Icons.Duo(color)
      };
    }
    const color = '#E879F9';
    return { 
      color, 
      bg: 'rgba(232, 121, 249, 0.1)', 
      instruction: t('squadInstruction'),
      icon: '👨‍👩‍👧‍👦',
      svgIcon: Icons.Squad(color)
    };
  };

  const mode = getModeStyles();

  return (
    <div 
      onClick={!isFull ? onClick : undefined}
      style={{
        background: 'var(--glass-bg)',
        color: 'var(--text-primary)',
        borderRadius: '32px',
        padding: '24px',
        width: '100%',
        border: `1px solid ${isFull ? 'rgba(239, 68, 68, 0.2)' : isLive ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)'}`,
        cursor: isFull ? 'not-allowed' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: isLive ? `0 0 30px ${mode.color}15` : 'var(--card-shadow)',
        transform: 'translateZ(0)',
      }}
      onMouseEnter={(e) => {
        if (!isFull) {
          e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
          e.currentTarget.style.borderColor = isLive ? '#10B981' : mode.color;
          e.currentTarget.style.boxShadow = `0 20px 40px ${mode.color}22`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.borderColor = isFull ? 'rgba(239, 68, 68, 0.2)' : isLive ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)';
        e.currentTarget.style.boxShadow = isLive ? `0 0 30px ${mode.color}15` : 'var(--card-shadow)';
      }}
    >
      <style>{`
        @keyframes ripple {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          100% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        }
        .live-pulse {
          animation: ripple 2s infinite;
        }
      `}</style>

      {/* Admin Edit Button */}
      {isAdminMode && (
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            background: 'var(--accent-orange)', 
            border: 'none', 
            borderRadius: '12px', 
            padding: '8px 12px', 
            color: 'white', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            cursor: 'pointer', 
            zIndex: 10, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            boxShadow: '0 4px 12px rgba(249, 111, 46, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          EDIT
        </button>
      )}

      {/* Background Glow */}
      <div style={{ 
        position: 'absolute', 
        top: '-100px', 
        left: '-100px', 
        width: '300px', 
        height: '300px', 
        background: `radial-gradient(circle, ${mode.color}10 0%, transparent 70%)`,
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              padding: '6px 12px', 
              borderRadius: '12px', 
              background: isLive ? 'rgba(16, 185, 129, 0.1)' : 'var(--glass-bg)', 
              border: `1px solid ${isLive ? '#10B98133' : 'var(--glass-border)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {isLive ? (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} className="live-pulse" />
              ) : (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-secondary)' }} />
              )}
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isLive ? '#10B981' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isLive ? 'Live' : status}
              </span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${mode.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${mode.color}33` }}>
              {mode.svgIcon}
            </div>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '8px 0 0 0', letterSpacing: '-0.02em' }}>{name}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{group} Arena</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            {status === 'finished' ? 'Final' : isLive ? getElapsedTime() : getUpcomingCountdown()}
          </div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {status === 'finished' ? 'Result' : isLive ? 'Elapsed' : 'Starts In'}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, background: 'var(--glass-bg)', padding: '16px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>PRIZE POOL</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-orange)' }}>$1,200</div>
        </div>
        <div style={{ flex: 1, background: 'var(--glass-bg)', padding: '16px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>PER KILL</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>$20</div>
        </div>
      </div>

      {/* Capacity Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
          <span style={{ color: 'var(--text-primary)' }}>Capacity</span>
          <span style={{ color: isFull ? '#EF4444' : 'var(--text-secondary)' }}>{currentParticipants}/{maxParticipants}</span>
        </div>
        <div style={{ height: '10px', background: 'var(--glass-bg)', borderRadius: '5px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            background: isFull ? '#EF4444' : 'var(--accent-gradient)',
            borderRadius: '5px',
            transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', marginLeft: '0px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--modal-bg)', background: 'var(--glass-bg)', marginLeft: i > 1 ? '-10px' : '0', overflow: 'hidden' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+123}`} alt="" style={{ width: '100%' }} />
              </div>
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>+ {players} Joined</span>
        </div>

        <button 
          disabled={isFull}
          style={{ 
            padding: '10px 20px', 
            borderRadius: '14px', 
            background: isFull ? 'rgba(239, 68, 68, 0.1)' : 'var(--accent-gradient)', 
            border: 'none', 
            color: isFull ? '#EF4444' : 'white', 
            fontWeight: 800, 
            fontSize: '0.85rem',
            cursor: isFull ? 'not-allowed' : 'pointer',
            boxShadow: isFull ? 'none' : '0 4px 12px rgba(249, 111, 46, 0.2)'
          }}
        >
          {isFull ? 'FULL' : 'JOIN'}
        </button>
      </div>
    </div>
  );
};

export default SliderCard;
