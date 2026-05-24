import BottomNav from '../components/BottomNav';
import { useBalance } from '../context/BalanceContext';

const mockBets = [
  { id: 1, matchName: 'Bermuda Clash Squad', type: 'Squad', result: 'Victory', amount: 50, status: 'won', profit: 100 },
  { id: 2, matchName: 'Purgatory Survival', type: 'Solo', result: 'Pending', amount: 10, status: 'pending', profit: 0 },
  { id: 3, matchName: 'Kalahari Duel', type: 'Duo', result: 'Defeat', amount: 25, status: 'lost', profit: 0 },
];

const MyBets = () => {
  const { balance } = useBalance();

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '65px', background: 'var(--bg-gradient)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ padding: '24px 12px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, background: 'var(--modal-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)' }}>
        <button 
          onClick={() => window.history.back()}
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', cursor: 'pointer', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 auto', transform: 'translateX(-20px)', letterSpacing: '-0.02em' }}>
          Bet <span style={{ color: 'var(--accent-orange)' }}>History</span>
        </h1>
      </div>

      <div style={{ padding: '24px 12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {mockBets.map((bet) => (
          <div 
            key={bet.id}
            style={{ 
              background: 'var(--glass-bg)', 
              borderRadius: '28px', 
              padding: '24px',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--card-shadow)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Status Badge */}
            <div style={{ 
              position: 'absolute', 
              top: '24px', 
              right: '24px',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: bet.status === 'won' ? 'rgba(16, 185, 129, 0.1)' : bet.status === 'lost' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: bet.status === 'won' ? '#10B981' : bet.status === 'lost' ? '#EF4444' : '#F59E0B',
              border: `1px solid ${bet.status === 'won' ? '#10B98133' : bet.status === 'lost' ? '#EF444433' : '#F59E0B33'}`
            }}>
              {bet.status}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: 'var(--accent-orange)', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{bet.type} MATCH</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>{bet.matchName}</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>STAKE</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>${bet.amount}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>RESULT</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: bet.status === 'won' ? '#10B981' : 'var(--text-primary)' }}>{bet.result}</span>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--glass-border)', marginBottom: '20px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Estimated Return</span>
              <span style={{ 
                fontSize: '1.3rem', 
                fontWeight: 900, 
                color: bet.status === 'won' ? '#10B981' : bet.status === 'lost' ? '#EF4444' : 'var(--text-primary)' 
              }}>
                {bet.status === 'won' ? `+$${bet.profit}` : bet.status === 'lost' ? '-$0' : 'Calculating...'}
              </span>
            </div>
          </div>
        ))}
      </div>


      <BottomNav />
    </div>
  );
};

export default MyBets;

