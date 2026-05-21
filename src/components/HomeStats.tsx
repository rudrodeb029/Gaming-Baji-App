import React from 'react';
import { Activity, Users, Trophy, Edit2 } from 'lucide-react';

interface HomeStatsProps {
  onStatClick: (type: 'live' | 'participants' | 'winners') => void;
  isAdminMode?: boolean;
  onEdit?: (stat: { id: string; label: string; value: string }) => void;
  customStats?: { id: string; label: string; value: string; color: string }[];
}

const HomeStats: React.FC<HomeStatsProps> = ({ onStatClick, isAdminMode, onEdit, customStats }) => {
  const defaultStats = [
    { id: 'live', label: 'Live Matches', value: '12', color: '#10B981', icon: (color: string) => (
      <Activity size={24} color={color} strokeWidth={2.5} />
    )},
    { id: 'participants', label: 'Participants', value: '1,420', color: '#38BDF8', icon: (color: string) => (
      <Users size={24} color={color} strokeWidth={2.5} />
    )},
    { id: 'winners', label: 'Winners', value: '840', color: '#FBBF24', icon: (color: string) => (
      <Trophy size={24} color={color} strokeWidth={2.5} />
    )}
  ];

  const stats = customStats ? defaultStats.map(ds => {
    const cs = customStats.find(c => c.id === ds.id);
    return cs ? { ...ds, ...cs } : ds;
  }) : defaultStats;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '12px', 
      padding: '0 12px', 
      marginBottom: '32px' 
    }}>
      <style>{`
        @keyframes glow-pulse {
          0% { box-shadow: 0 0 5px var(--glow-color); }
          50% { box-shadow: 0 0 20px var(--glow-color); }
          100% { box-shadow: 0 0 5px var(--glow-color); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--active-color) !important;
          box-shadow: 0 20px 40px var(--active-color-shadow) !important;
        }
        .stat-card:hover .stat-icon {
          transform: scale(1.1) rotate(5deg);
        }
        .stat-icon-wrapper {
          animation: float 3s ease-in-out infinite;
        }
        .edit-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--accent-orange);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 8px;
          display: flex;
          alignItems: center;
          justifyContent: center;
          font-size: 12px;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        }
        .edit-badge:hover {
          transform: scale(1.1);
        }
      `}</style>
      {stats.map((stat, i) => (
        <div 
          key={i}
          className="animate-fade-in stat-card"
          onClick={() => onStatClick(stat.id as any)}
          style={{ 
            '--active-color': stat.color,
            '--active-color-shadow': `${stat.color}33`,
            '--glow-color': `${stat.color}44`,
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            padding: '26px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--card-shadow)',
            animationDelay: `${i * 0.1}s`,
            opacity: 0,
            animationFillMode: 'forwards',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1
          } as any}
        >
          {isAdminMode && (
            <div 
              className="edit-badge"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(stat);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
          )}
          {/* Pulsing Light Beam */}
          <div style={{ 
            position: 'absolute', 
            top: '0', 
            left: '0', 
            width: '100%', 
            height: '2px', 
            background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
            animation: 'glow-pulse 2s infinite ease-in-out',
            opacity: 0.6
          }} />
          
          <div style={{ 
            background: `${stat.color}20`,
            padding: '12px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${stat.color}40`,
            boxShadow: `0 0 20px ${stat.color}20`,
            transition: 'all 0.3s ease',
            position: 'relative'
          }}>
            {stat.icon(stat.color)}
            {stat.id === 'live' && (
              <div className="live-badge-glow" style={{ 
                position: 'absolute', 
                top: '-2px', 
                right: '-2px', 
                width: '10px', 
                height: '10px', 
                background: '#10B981', 
                borderRadius: '50%',
                border: '2px solid var(--glass-bg)'
              }} />
            )}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '1.4rem', 
              fontWeight: 900, 
              color: 'var(--text-primary)',
              textShadow: `0 0 10px ${stat.color}40`,
              marginBottom: '2px'
            }}>
              {stat.value}
            </div>
            <div style={{ 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              {stat.label}
            </div>
          </div>


          {/* Background Glow */}
          <div style={{ 
            position: 'absolute', 
            bottom: '-20px', 
            width: '60px', 
            height: '60px', 
            background: stat.color, 
            filter: 'blur(40px)', 
            opacity: 0.15,
            zIndex: -1
          }} />
        </div>
      ))}
    </div>
  );
};

export default HomeStats;
