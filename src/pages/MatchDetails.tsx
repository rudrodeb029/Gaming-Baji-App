import { useParams, useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../context/AdminDashboardContext';
import { ArrowLeft, Users, Trophy, Target, Sword, Clock } from 'lucide-react';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminMatches, adminUsers } = useAdminDashboard();
  
  const match = adminMatches.find(m => m.id === id) || adminMatches[0];
  const participants = (match.participantIds || []).map(pid => 
    adminUsers.find(u => u.id === pid)
  ).filter(Boolean);

  if (!match) return <div>Match not found</div>;

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
      <div style={{ display: 'flex', padding: '0 12px', gap: '16px', borderBottom: '1px solid var(--glass-border)', marginBottom: '24px', overflowX: 'auto' }}>
        <div style={{ paddingBottom: '12px', borderBottom: '2px solid #F96F2E', color: 'var(--text-primary)', fontWeight: 700 }}>Statistics</div>
        <div style={{ paddingBottom: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Line-Up</div>
        <div style={{ paddingBottom: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>H2H</div>
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

      {/* Joined Users */}
      <div style={{ padding: '32px 24px', marginTop: '24px', background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="flex items-center justify-between mb-4">
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

      {match.status !== 'finished' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '24px', background: 'var(--modal-bg)', borderTop: '1px solid var(--glass-border)', zIndex: 10 }}>
          <button className="btn btn-primary w-full py-4 rounded-2xl font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(249,111,46,0.3)]">
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
                <span className="text-emerald-400 font-bold">+${winner.reward}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default MatchDetails;
