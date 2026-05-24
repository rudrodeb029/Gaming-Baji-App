import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../context/AdminDashboardContext';
import { ArrowLeft, Users, Trophy, Target, Sword, Clock, MessageSquare } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { useChat } from '../context/ChatContext';
import { useBalance } from '../context/BalanceContext';
import SuccessModal from '../components/SuccessModal';
import InsufficientBalanceModal from '../components/InsufficientBalanceModal';


const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminMatches, adminUsers, updateMatch, addParticipantToMatch } = useAdminDashboard();
  const { balance, deductBalance } = useBalance();
  const { formatCurrency } = useCurrency();
  const { messages, sendMessage } = useChat();


  const [activeTab, setActiveTab] = useState<'statistics' | 'lineup' | 'h2h' | 'chat'>('statistics');
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage, 'user');
    setInputMessage('');
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);
  
  const match = adminMatches.find(m => m.id === id) || adminMatches[0];
  const participants = (match.participantIds || []).map(pid => 
    adminUsers.find(u => u.id === pid)
  ).filter(Boolean);

  if (!match) return <div>Match not found</div>;

  const entryFee = match.bids && match.bids.length > 0 ? parseFloat(match.bids[0].replace(/[^0-9.-]+/g, '')) || 10 : 10;
  const count = match.currentParticipants > 0 ? match.currentParticipants : 12;
  const totalPrizePool = match.prizePool !== undefined && match.prizePool > 0 ? match.prizePool : count * entryFee * 1.8;
  
  const firstPrizeValue = match.firstPrize !== undefined && match.firstPrize > 0 ? match.firstPrize : totalPrizePool * 0.5;
  const secondPrizeValue = match.secondPrize !== undefined && match.secondPrize > 0 ? match.secondPrize : totalPrizePool * 0.3;
  const thirdPrizeValue = match.thirdPrize !== undefined && match.thirdPrize > 0 ? match.thirdPrize : totalPrizePool * 0.2;

  const [displayUserId] = useState(() => localStorage.getItem('generatedUserId') || 'USER123');
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedBetAmount, setSelectedBetAmount] = useState<number>(entryFee);
  const [isInsufficientBalanceOpen, setIsInsufficientBalanceOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [showJoinSuccess, setShowJoinSuccess] = useState(false);

  useEffect(() => {
    if (entryFee) {
      setSelectedBetAmount(entryFee);
    }
  }, [entryFee]);

  const handleJoinMatch = () => {
    if (deductBalance(selectedBetAmount)) {
      updateMatch(match.id, { 
        currentParticipants: Math.min(match.maxParticipants, match.currentParticipants + 1),
        totalBidsCount: `${Math.min(match.maxParticipants, match.currentParticipants + 1)} Players joined`
      });
      addParticipantToMatch(match.id, displayUserId);
      setShowJoinSuccess(true);
    } else {
      setIsInsufficientBalanceOpen(true);
    }
  };

  return (

    <div style={{ minHeight: '100vh', paddingBottom: '100px', position: 'relative', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ padding: '24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Match Details</span>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Match Overview */}
      <div style={{ padding: '0 12px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {match.group}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                <Sword className="w-8 h-8 text-orange-500 opacity-80" />
              </div>
              <span style={{ fontWeight: 700, textAlign: 'center' }}>{match.team1.name}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #F96F2E 0%, #F53844 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {match.score}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className={`w-2 h-2 rounded-full ${match.status === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span style={{ fontSize: '0.9rem', color: match.status === 'live' ? '#10B981' : 'var(--text-muted)', fontWeight: 700 }}>
                  {match.status === 'live' ? 'Live' : 'Finished'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                <Sword className="w-8 h-8 text-orange-500 opacity-80" />
              </div>
              <span style={{ fontWeight: 700, textAlign: 'center' }}>{match.team2.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 12px', gap: '20px', borderBottom: '1px solid var(--glass-border)', marginBottom: '24px', overflowX: 'auto' }}>
        <button 
          onClick={() => setActiveTab('statistics')}
          style={{ 
            background: 'none',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            paddingBottom: '12px', 
            borderBottom: activeTab === 'statistics' ? '2px solid #F96F2E' : '2px solid transparent', 
            color: activeTab === 'statistics' ? 'var(--text-primary)' : 'var(--text-muted)', 
            fontWeight: 700,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          Statistics
        </button>
        <button 
          onClick={() => setActiveTab('lineup')}
          style={{ 
            background: 'none',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            paddingBottom: '12px', 
            borderBottom: activeTab === 'lineup' ? '2px solid #F96F2E' : '2px solid transparent', 
            color: activeTab === 'lineup' ? 'var(--text-primary)' : 'var(--text-muted)', 
            fontWeight: activeTab === 'lineup' ? 700 : 600,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          Line-Up
        </button>
        <button 
          onClick={() => setActiveTab('h2h')}
          style={{ 
            background: 'none',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            paddingBottom: '12px', 
            borderBottom: activeTab === 'h2h' ? '2px solid #F96F2E' : '2px solid transparent', 
            color: activeTab === 'h2h' ? 'var(--text-primary)' : 'var(--text-muted)', 
            fontWeight: activeTab === 'h2h' ? 700 : 600,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          H2H
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          style={{ 
            background: 'none',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            paddingBottom: '12px', 
            borderBottom: activeTab === 'chat' ? '2px solid #F96F2E' : '2px solid transparent', 
            color: activeTab === 'chat' ? 'var(--text-primary)' : 'var(--text-muted)', 
            fontWeight: activeTab === 'chat' ? 700 : 600,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          <MessageSquare size={16} />
          Chat
        </button>
      </div>

      {/* Tab contents */}
      {activeTab === 'statistics' && (
        <>
          {/* Prize Pool Distribution */}
          <div style={{ padding: '0 12px', marginBottom: '32px' }}>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Prize Distribution</h3>
            </div>
            
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'var(--card-shadow)' }}>
              {/* Header Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                <div className="float-stagger-0">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Est. Prize Pool</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--accent-orange)' }}>
                    <AnimatedCounter value={totalPrizePool} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }} className="float-stagger-1">
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Per Kill Reward</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4ADE80' }}>
                    <AnimatedCounter value={entryFee * 0.2} />
                  </div>
                </div>
              </div>

              {/* Placements */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="float-stagger-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(251, 191, 36, 0.08)', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🥇</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>1st Place (Booyah!)</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#FBBF24', fontSize: '1rem' }}>
                    <AnimatedCounter value={firstPrizeValue} />
                  </span>
                </div>

                <div className="float-stagger-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(148, 163, 184, 0.08)', borderRadius: '12px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🥈</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>2nd Place</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#94A3B8', fontSize: '1rem' }}>
                    <AnimatedCounter value={secondPrizeValue} />
                  </span>
                </div>

                <div className="float-stagger-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(217, 119, 6, 0.08)', borderRadius: '12px', border: '1px solid rgba(217, 119, 6, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🥉</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>3rd Place</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#D97706', fontSize: '1rem' }}>
                    <AnimatedCounter value={thirdPrizeValue} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Statistics */}
          <div style={{ padding: '0 12px' }}>
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-orange-500" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Combat Statistics</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Total Kills */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span>{match.team1.kills}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Kills</span>
                  <span>{match.team2.kills}</span>
                </div>
                <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'var(--glass-bg)' }}>
                  <div style={{ width: `${(match.team1.kills / (match.team1.kills + match.team2.kills || 1)) * 100}%`, background: 'linear-gradient(90deg, #F96F2E, #F53844)' }} />
                  <div style={{ width: `${(match.team2.kills / (match.team1.kills + match.team2.kills || 1)) * 100}%`, background: 'rgba(255,255,255,0.1)' }} />
                </div>
              </div>

              {/* Total Damage */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span>{match.team1.damage}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Damage</span>
                  <span>{match.team2.damage}</span>
                </div>
                <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'var(--glass-bg)' }}>
                  <div style={{ width: `${(match.team1.damage / (match.team1.damage + match.team2.damage || 1)) * 100}%`, background: 'linear-gradient(90deg, #F96F2E, #F53844)' }} />
                  <div style={{ width: `${(match.team2.damage / (match.team1.damage + match.team2.damage || 1)) * 100}%`, background: 'rgba(255,255,255,0.1)' }} />
                </div>
              </div>
              
              {/* Survival Rank */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span>#{match.team1.rank}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Survival Rank</span>
                  <span>#{match.team2.rank}</span>
                </div>
                <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'var(--glass-bg)' }}>
                  <div style={{ width: `${(1 / (match.team1.rank || 1) / (1 / (match.team1.rank || 1) + 1 / (match.team2.rank || 1) || 1)) * 100}%`, background: 'linear-gradient(90deg, #F96F2E, #F53844)' }} />
                  <div style={{ width: `${(1 / (match.team2.rank || 1) / (1 / (match.team1.rank || 1) + 1 / (match.team2.rank || 1) || 1)) * 100}%`, background: 'rgba(255,255,255,0.1)' }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'lineup' && (
        /* Joined Users */
        <div style={{ padding: '0 12px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'var(--card-shadow)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Joined Participants ({participants.length})</h3>
              </div>
              <span className="text-xs text-white/40">Real-time update</span>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }} className="custom-scrollbar">
              {participants.length === 0 ? (
                <div className="text-white/40 text-sm italic">Waiting for players to join...</div>
              ) : (
                participants.map(user => user && (
                  <div key={user.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '70px' }}>
                    <div className="relative">
                      <img src={user.avatar} alt={user.name} style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #F96F2E', padding: '2px' }} />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black" />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
                  </div>
                ))
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '70px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,0.2)', cursor: 'pointer' }} className="hover:border-orange-500 transition-colors group">
                  <Users className="w-6 h-6 text-white/30 group-hover:text-orange-500" />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Invite</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'h2h' && (
        /* Head-to-Head Statistics */
        <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)' }}>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '16px', color: 'var(--text-primary)' }}>Head-to-Head Stats</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Win Rate */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>60% Wins</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Win Rate</span>
                  <span>40% Wins</span>
                </div>
                <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '60%', background: '#F96F2E' }} />
                  <div style={{ width: '40%', background: '#3B82F6' }} />
                </div>
              </div>

              {/* Avg Kills */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>14.5 Kills</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Avg Kills / Match</span>
                  <span>12.2 Kills</span>
                </div>
                <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '55%', background: '#F96F2E' }} />
                  <div style={{ width: '45%', background: '#3B82F6' }} />
                </div>
              </div>

              {/* Headshot % */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>34% Headshots</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Headshot Accuracy</span>
                  <span>29% Headshots</span>
                </div>
                <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '54%', background: '#F96F2E' }} />
                  <div style={{ width: '46%', background: '#3B82F6' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', paddingLeft: '8px' }}>Recent Encounters</h4>
            
            <div className="glass-panel" style={{ padding: '16px', borderRadius: '18px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>FreeFire Pro League</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{match.team1.name} vs {match.team2.name}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: 800, color: '#4ADE80', fontSize: '1rem' }}>21 - 18</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>May 12, 2026</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderRadius: '18px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Squad Showdown</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{match.team1.name} vs {match.team2.name}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: 800, color: '#3B82F6', fontSize: '1rem' }}>14 - 15</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Apr 28, 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        /* Chat System */
        <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ 
            padding: '20px', 
            borderRadius: '24px', 
            background: 'var(--glass-bg)', 
            border: '1px solid var(--glass-border)', 
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            flexDirection: 'column',
            height: '420px',
            overflow: 'hidden'
          }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Match Discussion</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Discuss strategies and gameplay live</p>
            </div>

            {/* Messages Area */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              marginBottom: '16px',
              paddingRight: '4px'
            }} className="custom-scrollbar">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div 
                    key={msg.id} 
                    className="animate-message-in"
                    style={{ 
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {!isUser && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', marginBottom: '2px', fontWeight: 700 }}>
                        {msg.userName || 'Support Bot'}
                      </span>
                    )}
                    <div style={{ 
                      background: isUser ? 'var(--accent-gradient)' : 'var(--card-inner-bg)',
                      padding: '10px 14px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      color: isUser ? '#fff' : 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      border: isUser ? 'none' : '1px solid var(--glass-border)',
                      boxShadow: isUser ? '0 4px 12px rgba(227, 67, 96, 0.15)' : 'none'
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{msg.time}</span>
                      {isUser && (
                        <span style={{ 
                          fontSize: '0.6rem', 
                          color: msg.status === 'sending' ? 'var(--text-muted)' : '#10B981', 
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {msg.status === 'sending' ? (
                            <span style={{ 
                              display: 'inline-block',
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              background: 'var(--text-secondary)',
                              animation: 'pulse 1s infinite'
                            }} />
                          ) : (
                            '✓✓'
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSendMessage}
              style={{ 
                display: 'flex', 
                gap: '10px',
                borderTop: '1px solid var(--glass-border)',
                paddingTop: '12px'
              }}
            >
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  background: 'var(--card-inner-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(227, 67, 96, 0.2)'
                }}
                className="hover-scale"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {match.status !== 'finished' && activeTab !== 'chat' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '24px', background: 'var(--modal-bg)', borderTop: '1px solid var(--glass-border)', zIndex: 10 }}>
          <button 
            onClick={() => {
              setShowJoinSuccess(false);
              setIsBetModalOpen(true);
            }}
            className="btn btn-primary w-full py-4 rounded-2xl font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(249,111,46,0.3)]"
          >
            PLACE A BET
          </button>
        </div>
      )}


      {match.status === 'finished' && match.winners && (
        <div style={{ padding: '24px', marginTop: '24px', background: 'rgba(249,111,46,0.1)', border: '1px solid rgba(249,111,46,0.2)', borderRadius: '24px', margin: '12px' }}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-white">Final Winners</h3>
          </div>
          <div className="space-y-3">
            {match.winners.map((winner, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-slate-300 text-black' : 'bg-amber-700 text-white'}`}>
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold">{winner.userName}</span>
                </div>
                <span className="text-emerald-400 font-bold">+{formatCurrency(winner.reward)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Match Joined!"
        message={`You have successfully joined the ${match.group}. Good luck!`}
      />

      {/* Insufficient Balance Modal */}
      <InsufficientBalanceModal 
        isOpen={isInsufficientBalanceOpen}
        onClose={() => setIsInsufficientBalanceOpen(false)}
        requiredAmount={selectedBetAmount}
        currentBalance={balance}
      />

      {/* Slide-Up Betting Modal */}
      {isBetModalOpen && (
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
          onClick={() => { if(!showJoinSuccess) setIsBetModalOpen(false); }}
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
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' }}>Confirm Entry</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>{match.group} Arena</p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '16px' }}>Entry Fee</p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {[100, 10, 5].map((amount) => (
                      <button 
                        key={amount}
                        type="button"
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
                  Join Now
                </button>
                
                <button 
                  type="button"
                  onClick={() => setIsBetModalOpen(false)}
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
                <h4 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-primary)' }}>Joined Successfully!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
                  You have successfully joined the match!
                </p>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '80%', padding: '12px', borderRadius: '12px', marginTop: '24px', margin: '24px auto 0' }}
                  onClick={() => setIsBetModalOpen(false)}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default MatchDetails;

