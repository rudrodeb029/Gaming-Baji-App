import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import SliderCard from '../components/SliderCard';
import HomeStats from '../components/HomeStats';
import LiveChat from '../components/LiveChat';
import SideMenu from '../components/SideMenu';
import { matches, currentUser, winners, topParticipants } from '../data/mockData';
import type { Match, Winner, TopParticipant } from '../data/mockData';
import { useBalance } from '../context/BalanceContext';
import { useAdmin } from '../context/AdminContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAdminDashboard } from '../context/AdminDashboardContext';
import SuccessModal from '../components/SuccessModal';

import { 
  Menu, 
  Sun, 
  Moon, 
  Plus, 
  Trophy, 
  Users, 
  Activity,
  Trash2,
  Edit2,
  PlusCircle,
  X
} from 'lucide-react';

const Home = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAdminMode } = useAdmin();
  const { t } = useLanguage();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  
  const { 
    adminMatches: localMatches, 
    stats: adminStats,
    updateMatch,
    winners: globalWinners,
    addPaymentRequest,
    incrementUserMatches,
    adminUsers,
    addParticipantToMatch
  } = useAdminDashboard();
  
  const [localParticipants, setLocalParticipants] = useState<TopParticipant[]>(() => {
    const saved = localStorage.getItem('localParticipants');
    return saved ? JSON.parse(saved) : topParticipants;
  });

  const displayStats = [
    { id: 'live', value: adminStats.activeMatches.toString(), label: 'Live Matches' },
    { id: 'participants', value: adminStats.totalUsers.toLocaleString(), label: 'Participants' },
    { id: 'winners', value: adminStats.totalWinners.toLocaleString(), label: 'Winners' }
  ];

  const navigate = useNavigate();

  const { balance, deductBalance, addBalance } = useBalance();
  const [selectedBetAmount, setSelectedBetAmount] = useState<number>(10);
  const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [showJoinSuccess, setShowJoinSuccess] = useState(false);
  const [activeStatType, setActiveStatType] = useState<'live' | 'participants' | 'winners' | null>(null);
  const [successConfig, setSuccessConfig] = useState<{ isOpen: boolean, title: string, message: string }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsedTime = (liveStartedAt?: number, fallbackTime?: string) => {
    if (!liveStartedAt) return fallbackTime || '00:00:00';
    const elapsed = Math.max(0, Math.floor((Date.now() - liveStartedAt) / 1000));
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const triggerSuccess = (title: string, message: string) => {
    setSuccessConfig({ isOpen: true, title, message });
  };

  // Persistence effects
  useEffect(() => { localStorage.setItem('localParticipants', JSON.stringify(localParticipants)); }, [localParticipants]);

  // Edit Modals State
  const [editingStat, setEditingStat] = useState<any>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editingWinner, setEditingWinner] = useState<Winner | null>(null);
  const [editingParticipant, setEditingParticipant] = useState<AdminUser | null>(null);

  const handleJoinSuccess = (matchId: string) => {
    const match = localMatches.find(m => m.id === matchId);
    if (match) {
      updateMatch(matchId, { 
        currentParticipants: Math.min(match.maxParticipants, match.currentParticipants + 1),
        totalBidsCount: `${Math.min(match.maxParticipants, match.currentParticipants + 1)} Players joined`
      });
      addParticipantToMatch(matchId, displayUserId);
    }
  };

  const handleJoinMatch = () => {
    if (deductBalance(selectedBetAmount)) {
      handleJoinSuccess(selectedMatch!.id);
      setSelectedMatch(null);
      triggerSuccess("Match Joined!", `You have successfully joined the ${selectedMatch?.group}. Good luck!`);
    } else {
      alert("Insufficient balance!");
    }
  };

  const [displayUserId] = useState(() => localStorage.getItem('generatedUserId') || 'USER123');

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      addPaymentRequest({
        userId: displayUserId,
        amount: amount,
        transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        paymentMethod: 'Quick Add',
        accountNumber: 'User Account',
      });
      setDepositAmount('');
      setShowAddConfirm(false);
      setIsAddBalanceOpen(false);
      triggerSuccess("Deposit Request Sent!", `$${amount} deposit request has been sent for admin approval.`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '65px', position: 'relative', background: 'var(--bg-gradient)', color: 'var(--text-primary)', transition: 'all 0.3s ease', overflowY: 'auto' }}>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Premium Header */}
      <div style={{ 
        padding: '26px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-dark)',
        opacity: 0.95,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => setIsMenuOpen(true)}
            style={{ 
              background: 'var(--glass-bg)', 
              border: '1px solid var(--glass-border)', 
              padding: '10px',
              borderRadius: '14px',
              cursor: 'pointer', 
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>

          {/* Modern Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{ 
              background: 'var(--glass-bg)', 
              border: '1px solid var(--glass-border)', 
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              cursor: 'pointer', 
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setIsAddBalanceOpen(true)}
            style={{ 
              background: 'var(--glass-bg)', 
              padding: '8px 14px', 
              borderRadius: '16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={14} color="white" strokeWidth={3} />
            </div>
            ${balance.toFixed(2)}
          </button>
          <button 
            onClick={() => navigate('/profile')}
            style={{ width: '44px', height: '44px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--glass-border)', cursor: 'pointer', padding: 0 }}
          >
            <img src={currentUser.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        </div>
      </div>

      {/* Main Title Section */}
      <div style={{ padding: '32px 12px 16px', position: 'relative' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: 0, marginBottom: '6px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {t('gamingArena').split(' ')[0]} <span style={{ color: 'var(--accent-orange)' }}>{t('gamingArena').split(' ')[1]}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>{t('arenaSub')}</p>
        
        {/* Decorative FF Logo */}
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/3/36/Free_Fire_logo.png" 
          style={{ position: 'absolute', right: '12px', top: '40px', width: '80px', opacity: 0.1, filter: isDarkMode ? 'grayscale(1)' : 'none' }} 
        alt="FF" />
      </div>

      <HomeStats 
        isAdminMode={isAdminMode} 
        customStats={displayStats as any}
        onStatClick={(type) => setActiveStatType(type)} 
        onEdit={(stat) => setEditingStat(stat)}
      />

      {/* Vertical Match Column */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '20px',
        padding: '0 12px',
        paddingBottom: '24px',
      }}>
        {localMatches.map((match, index) => (
          <div 
            key={match.id} 
            className="animate-slide-up" 
            style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
          >
            <SliderCard 
              group={match.group}
              players={match.totalPlayersCount}
              team1={match.team1}
              team2={match.team2}
              {...match}
              status={match.status}
              name={match.name}
              liveStartedAt={match.liveStartedAt}
              onClick={() => setSelectedMatch(match)}
              isAdminMode={isAdminMode}
              onEdit={() => setEditingMatch(match)}
            />
          </div>
        ))}
      </div>

      <BottomNav />
      

      <SuccessModal 
        isOpen={successConfig.isOpen}
        onClose={() => setSuccessConfig(prev => ({ ...prev, isOpen: false }))}
        title={successConfig.title}
        message={successConfig.message}
      />

      {/* Modern Betting Modal */}
      {selectedMatch && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end'
          }}
          onClick={() => { if(!showJoinSuccess) setSelectedMatch(null); }}
        >
          <div 
            className="animate-slide-up"
            style={{
              background: 'var(--modal-bg)',
              width: '100%',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px',
              padding: '24px 16px',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 -20px 40px rgba(0,0,0,0.5)',
              minHeight: '400px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '40px', height: '5px', background: 'var(--glass-border)', borderRadius: '10px', margin: '0 auto 32px' }} />

            
            {!showJoinSuccess ? (
              <div className="animate-fade-in">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' }}>{t('confirmEntry')}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>{selectedMatch.group} {t('arena') || 'Arena'}</p>
                </div>


                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '16px' }}>{t('entryFee')}</p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {[100, 10, 5].map((amount) => (
                      <button 
                        key={amount}
                        onClick={() => setSelectedBetAmount(amount)}
                        style={{ 
                          flex: 1, 
                          padding: '20px', 
                          borderRadius: '20px', 
                          border: '2px solid',
                          borderColor: selectedBetAmount === amount ? 'var(--accent-orange)' : 'var(--glass-border)', 
                          background: selectedBetAmount === amount ? 'rgba(249, 111, 46, 0.1)' : 'var(--glass-bg)', 
                          color: 'var(--text-primary)', 
                          fontWeight: 800, 
                          fontSize: '1.2rem', 
                          cursor: 'pointer', 
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                        }}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>


                <button 
                  className="btn btn-primary" 
                  style={{ padding: '20px', borderRadius: '20px', fontSize: '1.1rem', letterSpacing: '0.05em' }}
                  onClick={handleJoinMatch}
                >
                  {t('joinNow')}
                </button>
                
                <button 
                  onClick={() => setSelectedMatch(null)}
                  style={{ width: '100%', background: 'none', border: 'none', color: '#6B7280', marginTop: '20px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="animate-scale-up" style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 32px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-primary)' }}>{t('joined')}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
                  {t('success')}! {t('joined')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stat Detail Modal */}
      {activeStatType && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'flex-end'
          }}
          onClick={() => setActiveStatType(null)}
        >
          <div 
            className="animate-slide-up"
            style={{
              background: 'var(--modal-bg)',
              width: '100%',
              maxHeight: '85vh',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px',
              padding: '24px 16px',
              color: 'var(--text-primary)',
              borderTop: '1px solid var(--glass-border)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.8)',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '40px', height: '5px', background: 'var(--glass-border)', borderRadius: '10px', margin: '0 auto 24px' }} />

            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, textTransform: 'capitalize' }}>
                {activeStatType === 'live' ? t('live') : activeStatType} <span style={{ color: 'var(--accent-orange)' }}>{t('details')}</span>
              </h3>
              <button 
                onClick={() => setActiveStatType(null)}
                style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '8px', borderRadius: '12px', color: 'var(--text-primary)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeStatType === 'live' && localMatches.filter(m => m.status === 'live').map((match) => (
                <div key={match.id} style={{ background: 'var(--glass-bg)', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                  {isAdminMode && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingMatch(match); }}
                      style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--accent-orange)', border: 'none', borderRadius: '8px', padding: '4px 8px', color: 'white', fontSize: '10px', fontWeight: 800, cursor: 'pointer', zIndex: 10 }}
                    >EDIT</button>
                  )}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase', marginBottom: '4px' }}>{match.group}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{match.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{match.currentParticipants}/{match.maxParticipants} Joined</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="live-badge-glow" style={{ background: '#10B981', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900, color: 'white', marginBottom: '8px', display: 'inline-block' }}>LIVE</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{match.score}</div>
                    <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>{formatElapsedTime(match.liveStartedAt, match.time)} Elapsed</div>
                  </div>


                </div>
              ))}

              {activeStatType === 'participants' && adminUsers.map((player) => (
                <div key={player.id} style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                  {isAdminMode && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingParticipant(player); }}
                      style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--accent-orange)', border: 'none', borderRadius: '8px', padding: '4px 8px', color: 'white', fontSize: '10px', fontWeight: 800, cursor: 'pointer', zIndex: 10 }}
                    >EDIT</button>
                  )}
                  <img src={player.avatar} alt={player.name} style={{ width: '56px', height: '56px', borderRadius: '16px', border: '1px solid var(--glass-border)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{player.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@{player.username} • {player.totalMatches} Matches</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-orange)' }}>{player.totalMatches}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>PLAYED</div>
                  </div>

                </div>
              ))}

              {activeStatType === 'winners' && globalWinners.map((winner) => (
                <div key={winner.id} style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                  {isAdminMode && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingWinner(winner); }}
                      style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--accent-orange)', border: 'none', borderRadius: '8px', padding: '4px 8px', color: 'white', fontSize: '10px', fontWeight: 800, cursor: 'pointer', zIndex: 10 }}
                    >EDIT</button>
                  )}
                  <img src={winner.avatar} alt={winner.name} style={{ width: '56px', height: '56px', borderRadius: '16px', border: '1px solid var(--glass-border)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{winner.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{winner.match} • {winner.time}</div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FBBF24' }}>{winner.amount}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>PRIZE</div>
                  </div>

                </div>
              ))}
            </div>

            <button 
              onClick={() => setActiveStatType(null)}
              style={{ width: '100%', padding: '18px', borderRadius: '20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontWeight: 700, marginTop: '32px', cursor: 'pointer' }}
            >

              CLOSE DETAILS
            </button>
          </div>
        </div>
      )}
      {isAddBalanceOpen && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setIsAddBalanceOpen(false)}
        >
          <div 
            className="animate-scale-up"
            style={{
              background: 'var(--modal-bg)',
              width: '100%',
              maxWidth: '420px',
              borderRadius: '40px',
              padding: '24px 16px',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
              position: 'relative',
              overflow: 'hidden'
            }}

            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Glow */}
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(249, 111, 46, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, textAlign: 'center', marginBottom: '32px', letterSpacing: '-0.02em' }}>
              Add <span style={{ color: 'var(--accent-orange)' }}>Funds</span>
            </h3>
            
            {!showAddConfirm ? (
              <div className="animate-fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                  {[10, 50, 100, 500].map(amount => (
                    <button 
                      key={amount}
                      onClick={() => setDepositAmount(amount.toString())}
                      style={{
                        padding: '20px',
                        borderRadius: '24px',
                        border: '2px solid',
                        borderColor: depositAmount === amount.toString() ? 'var(--accent-orange)' : 'var(--glass-border)',
                        background: depositAmount === amount.toString() ? 'rgba(249, 111, 46, 0.1)' : 'var(--glass-bg)',
                        color: 'var(--text-primary)',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}

                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div style={{ marginBottom: '40px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Custom Amount</label>
                  <div style={{ position: 'relative' }}>

                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-orange)' }}>$</span>
                    <input 
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: '100%',
                        background: 'var(--glass-bg)',
                        border: '2px solid var(--glass-border)',
                        borderRadius: '24px',
                        padding: '20px 20px 20px 45px',
                        color: 'var(--text-primary)',
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}

                      onFocus={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}

                    />
                  </div>
                </div>

                <button 
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '22px', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.05em' }}
                  onClick={() => setShowAddConfirm(true)}
                >
                  PROCEED TO CONFIRM
                </button>
              </div>
            ) : (
              <div className="animate-scale-up" style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 32px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" className="animate-bounce-subtle">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Confirm Deposit</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1rem', lineHeight: 1.6 }}>
                  You are adding <span style={{ color: '#10B981', fontWeight: 900, fontSize: '1.2rem' }}>${parseFloat(depositAmount).toLocaleString()}</span> to your secure wallet.
                </p>

                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={handleDeposit}
                    style={{ 
                      width: '100%', 
                      padding: '22px', 
                      borderRadius: '24px', 
                      background: '#10B981', 
                      border: 'none', 
                      color: 'white', 
                      fontWeight: 900, 
                      fontSize: '1.1rem', 
                      cursor: 'pointer',
                      boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    CONFIRM & ADD NOW
                  </button>
                  <button 
                    onClick={() => setShowAddConfirm(false)}
                    style={{ 
                      width: '100%', 
                      padding: '16px', 
                      borderRadius: '24px', 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      fontWeight: 700, 
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Cancel and go back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Edit Stat Modal */}
      {editingStat && (
        <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setEditingStat(null)}>
          <div className="animate-scale-up" style={{ background: 'var(--modal-bg)', width: '100%', maxWidth: '400px', borderRadius: '32px', padding: '24px 16px', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', textAlign: 'center' }}>Edit <span style={{ color: 'var(--accent-orange)' }}>{editingStat.label}</span></h3>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>STAT VALUE</label>
              <input 
                type="text"
                defaultValue={editingStat.value}
                id="edit-stat-value"
                style={{ width: '100%', background: 'var(--glass-bg)', border: '2px solid var(--glass-border)', borderRadius: '16px', padding: '16px', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', color: '#FFFFFF' }}
                onClick={() => {
                  const val = (document.getElementById('edit-stat-value') as HTMLInputElement).value;
                  setCustomStats((prev: any) => prev.map((s: any) => s.id === editingStat.id ? { ...s, value: val } : s));
                  setEditingStat(null);
                }}
              >SAVE CHANGES</button>
              <button 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => setEditingStat(null)}
              >CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Match Modal */}
      {editingMatch && (
        <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setEditingMatch(null)}>
          <div className="animate-scale-up" style={{ background: 'var(--modal-bg)', width: '100%', maxWidth: '450px', borderRadius: '32px', padding: '24px 16px', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', textAlign: 'center' }}>Edit <span style={{ color: 'var(--accent-orange)' }}>Match</span></h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>MATCH NAME</label>
                <input type="text" id="edit-match-name" defaultValue={editingMatch.name} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>GAME MODE</label>
                  <input type="text" id="edit-match-group" defaultValue={editingMatch.group} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>MATCH TIME</label>
                  <input type="text" id="edit-match-time" defaultValue={editingMatch.time} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>TEAM 1 NAME</label>
                  <input type="text" id="edit-match-team1" defaultValue={editingMatch.team1.name} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>TEAM 2 NAME</label>
                  <input type="text" id="edit-match-team2" defaultValue={editingMatch.team2.name} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>SCORE</label>
                  <input type="text" id="edit-match-score" defaultValue={editingMatch.score} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>STATUS</label>
                  <select id="edit-match-status" defaultValue={editingMatch.status} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }}>
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>PARTICIPANTS</label>
                  <input type="number" id="edit-match-current" defaultValue={editingMatch.currentParticipants} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>MAX SLOTS</label>
                  <input type="number" id="edit-match-max" defaultValue={editingMatch.maxParticipants} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', color: '#FFFFFF' }}
                onClick={() => {
                  const name = (document.getElementById('edit-match-name') as HTMLInputElement).value;
                  const score = (document.getElementById('edit-match-score') as HTMLInputElement).value;
                  const status = (document.getElementById('edit-match-status') as HTMLSelectElement).value as any;
                  const group = (document.getElementById('edit-match-group') as HTMLInputElement).value;
                  const time = (document.getElementById('edit-match-time') as HTMLInputElement).value;
                  const team1Name = (document.getElementById('edit-match-team1') as HTMLInputElement).value;
                  const team2Name = (document.getElementById('edit-match-team2') as HTMLInputElement).value;
                  const current = parseInt((document.getElementById('edit-match-current') as HTMLInputElement).value);
                  const max = parseInt((document.getElementById('edit-match-max') as HTMLInputElement).value);
                  
                  setLocalMatches(prev => prev.map(m => m.id === editingMatch.id ? { 
                    ...m, 
                    name,
                    score, 
                    status, 
                    group, 
                    time,
                    team1: { ...m.team1, name: team1Name },
                    team2: { ...m.team2, name: team2Name },
                    currentParticipants: current, 
                    maxParticipants: max 
                  } : m));
                  setEditingMatch(null);
                }}
              >SAVE MATCH</button>
              <button 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => setEditingMatch(null)}
              >CANCEL</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Winner Modal */}
      {editingWinner && (
        <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setEditingWinner(null)}>
          <div className="animate-scale-up" style={{ background: 'var(--modal-bg)', width: '100%', maxWidth: '400px', borderRadius: '32px', padding: '24px 16px', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', textAlign: 'center' }}>Edit <span style={{ color: 'var(--accent-orange)' }}>Winner</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>NAME</label>
                <input type="text" id="edit-winner-name" defaultValue={editingWinner.name} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>PRIZE AMOUNT</label>
                <input type="text" id="edit-winner-amount" defaultValue={editingWinner.amount} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', color: '#FFFFFF' }}
                onClick={() => {
                  const name = (document.getElementById('edit-winner-name') as HTMLInputElement).value;
                  const amount = (document.getElementById('edit-winner-amount') as HTMLInputElement).value;
                  setLocalWinners(prev => prev.map(w => w.id === editingWinner.id ? { ...w, name, amount } : w));
                  setEditingWinner(null);
                }}
              >SAVE</button>
              <button 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => setEditingWinner(null)}
              >CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Participant Modal */}
      {editingParticipant && (
        <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setEditingParticipant(null)}>
          <div className="animate-scale-up" style={{ background: 'var(--modal-bg)', width: '100%', maxWidth: '400px', borderRadius: '32px', padding: '24px 16px', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', textAlign: 'center' }}>Edit <span style={{ color: 'var(--accent-orange)' }}>Participant</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>NAME</label>
                <input type="text" id="edit-part-name" defaultValue={editingParticipant.name} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 700 }}>MATCHES PLAYED</label>
                <input type="number" id="edit-part-matches" defaultValue={editingParticipant.matches} style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 700 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', color: '#FFFFFF' }}
                onClick={() => {
                  const name = (document.getElementById('edit-part-name') as HTMLInputElement).value;
                  const matchesVal = parseInt((document.getElementById('edit-part-matches') as HTMLInputElement).value);
                  setLocalParticipants(prev => prev.map(p => p.id === editingParticipant.id ? { ...p, name, matches: matchesVal } : p));
                  setEditingParticipant(null);
                }}
              >SAVE</button>
              <button 
                style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => setEditingParticipant(null)}
              >CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Reset Button */}
      {isAdminMode && (
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all data to default? This will clear all your edits.')) {
              localStorage.removeItem('localMatches');
              localStorage.removeItem('localWinners');
              localStorage.removeItem('localParticipants');
              localStorage.removeItem('customStats');
              window.location.reload();
            }
          }}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: 800,
            border: 'none',
            boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)',
            zIndex: 100,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          RESET DATA
        </button>
      )}
    </div>
  );
};

export default Home;
