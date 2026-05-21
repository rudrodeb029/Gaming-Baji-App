import { useState, useEffect } from 'react';
import { currentUser } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import { useBalance } from '../context/BalanceContext';
import { useAdmin } from '../context/AdminContext';
import { useTheme } from '../context/ThemeContext';
import { useAdminDashboard } from '../context/AdminDashboardContext';
import { 
  Plus, 
  Trash2, 
  PlusCircle, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  History, 
  CreditCard,
  ChevronLeft,
  Edit2,
  Check,
  Minus,
  Globe
} from 'lucide-react';
import GlobalActivityFeed from '../components/GlobalActivityFeed';

const Wallet = () => {
  const { isDarkMode } = useTheme();
  const { isAdminMode } = useAdmin();
  const { balance, addBalance, deductBalance, transactions: localTransactions } = useBalance();
  const { addPaymentRequest, addWithdrawalRequest, paymentRequests, withdrawalRequests } = useAdminDashboard();
  const [displayUserId] = useState(() => localStorage.getItem('generatedUserId') || currentUser.id);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isWithdrawConfirming, setIsWithdrawConfirming] = useState(false);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, type: 'gateway' | 'method' } | null>(null);
  const [historyTab, setHistoryTab] = useState<'personal' | 'community'>('personal');
  
  // Dynamic Gateways State
  const [localGateways, setLocalGateways] = useState(() => {
    const saved = localStorage.getItem('localGateways');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'bkash-default', name: 'Bkash', color: '#E2136E', logo: 'https://raw.githubusercontent.com/ultraDevs/Bangladeshi-Payment-Gateways/master/assets/images/Bkash.png' },
      { id: 'nagad-default', name: 'Nagad', color: '#F15A22', logo: 'https://raw.githubusercontent.com/ultraDevs/Bangladeshi-Payment-Gateways/master/assets/images/Nagad.png' },
      { id: 'binance-default', name: 'Binance', color: '#F3BA2F', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' }
    ];
  });

  const [showAddGateway, setShowAddGateway] = useState(false);
  const [newGateway, setNewGateway] = useState({ name: '', color: '#F96F2E', logo: '' });

  // User's Personal Saved Methods
  const [savedMethods, setSavedMethods] = useState(() => {
    const saved = localStorage.getItem('savedMethods');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethodData, setNewMethodData] = useState({ name: '', number: '' });

  useEffect(() => {
    localStorage.setItem('localGateways', JSON.stringify(localGateways));
  }, [localGateways]);

  useEffect(() => {
    localStorage.setItem('savedMethods', JSON.stringify(savedMethods));
  }, [savedMethods]);

  // Automatic Logo Migration for broken seeklogo URLs
  useEffect(() => {
    const assetMap: Record<string, string> = {
      'bkash': 'https://raw.githubusercontent.com/ultraDevs/Bangladeshi-Payment-Gateways/master/assets/images/Bkash.png',
      'nagad': 'https://raw.githubusercontent.com/ultraDevs/Bangladeshi-Payment-Gateways/master/assets/images/Nagad.png',
      'binance': 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
    };

    let changed = false;
    const updatedGateways = localGateways.map((gw: any) => {
      if (gw.logo && gw.logo.includes('seeklogo.com')) {
        const key = gw.name.toLowerCase();
        if (assetMap[key]) {
          changed = true;
          return { ...gw, logo: assetMap[key] };
        }
      }
      return gw;
    });

    const updatedMethods = savedMethods.map((m: any) => {
      if (m.icon && m.icon.includes('seeklogo.com')) {
        const key = m.name.toLowerCase();
        if (assetMap[key]) {
          changed = true;
          return { ...m, icon: assetMap[key] };
        }
      }
      return m;
    });

    if (changed) {
      setLocalGateways(updatedGateways);
      setSavedMethods(updatedMethods);
    }
  }, []);

  const handleDeleteGateway = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmation({ id, type: 'gateway' });
  };

  const confirmDelete = () => {
    if (!deleteConfirmation) return;
    const { id, type } = deleteConfirmation;

    if (type === 'gateway') {
      setLocalGateways(prev => {
        const updated = prev.filter((g: any) => g.id !== id);
        localStorage.setItem('localGateways', JSON.stringify(updated));
        return updated;
      });
      if (selectedGateway === id) setSelectedGateway(null);
    } else {
      setSavedMethods(prev => {
        const updated = prev.filter((m: any) => m.id !== id);
        localStorage.setItem('savedMethods', JSON.stringify(updated));
        return updated;
      });
      if (selectedWithdrawMethod === id) setSelectedWithdrawMethod(null);
    }
    setDeleteConfirmation(null);
  };

  const handleAddGateway = () => {
    if (!newGateway.name || !newGateway.logo) {
      alert('Please fill all fields');
      return;
    }
    const id = Date.now().toString();
    setLocalGateways(prev => {
      const updated = [...prev, { ...newGateway, id }];
      localStorage.setItem('localGateways', JSON.stringify(updated));
      return updated;
    });
    setNewGateway({ name: '', color: '#F96F2E', logo: '' });
    setShowAddGateway(false);
  };

  const addPresetGateway = (name: string, color: string, logo: string) => {
    const id = Date.now().toString();
    const gateway = { name, color, logo, id };
    setLocalGateways(prev => {
      const updated = [...prev, gateway];
      localStorage.setItem('localGateways', JSON.stringify(updated));
      return updated;
    });
    setShowAddGateway(false);
  };

  const handleDeleteMethod = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmation({ id, type: 'method' });
  };

  const handleAddMethod = () => {
    if (!newMethodData.name || !newMethodData.number) {
      alert('Please fill all fields');
      return;
    }
    const icons: Record<string, string> = {
      'bkash': 'https://raw.githubusercontent.com/ultraDevs/Bangladeshi-Payment-Gateways/master/assets/images/Bkash.png',
      'nagad': 'https://raw.githubusercontent.com/ultraDevs/Bangladeshi-Payment-Gateways/master/assets/images/Nagad.png',
      'binance': 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
    };
    const colors: Record<string, string> = {
      'bkash': '#E2136E',
      'nagad': '#F15A22',
      'binance': '#F3BA2F'
    };
    const newEntry = {
      id: Date.now().toString(),
      name: newMethodData.name,
      number: newMethodData.number,
      icon: icons[newMethodData.name.toLowerCase()] || 'https://cdn-icons-png.flaticon.com/512/4021/4021708.png',
      color: colors[newMethodData.name.toLowerCase()] || '#F96F2E'
    };
    setSavedMethods(prev => [...prev, newEntry]);
    setShowAddMethod(false);
    setNewMethodData({ name: '', number: '' });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!selectedWithdrawMethod) {
      alert('Please select a withdrawal method');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount > balance) {
      alert('Insufficient balance');
      return;
    }
    setIsWithdrawConfirming(true);
  };

  const confirmWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    const method = savedMethods.find(m => m.id === selectedWithdrawMethod);
    
    if (amount > 0 && method) {
      addWithdrawalRequest({
        userId: displayUserId,
        amount: amount,
        withdrawMethod: method.name,
        accountNumber: method.number,
        accountName: 'User Account',
      });
      
      setWithdrawAmount('');
      setSelectedWithdrawMethod(null);
      setIsWithdrawConfirming(false);
      alert('Withdrawal request submitted! It will be processed after admin approval.');
    }
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    const gateway = localGateways.find(g => g.id === selectedGateway);
    
    if (!isNaN(amount) && amount > 0 && gateway) {
      addPaymentRequest({
        userId: displayUserId,
        amount: amount,
        transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        paymentMethod: gateway.name,
        accountNumber: 'User Account',
      });
      
      setDepositAmount('');
      setSelectedGateway(null);
      setIsConfirming(false);
      alert('Deposit request submitted! Balance will update after admin approval.');
    }
  };



  const handleQuickSelect = (amount: number) => {
    setDepositAmount(amount.toString());
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '65px', background: 'var(--bg-gradient)', color: 'var(--text-primary)', position: 'relative', overflowX: 'hidden' }}>
      {/* Premium Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 10, background: 'var(--modal-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)' }}>

        <button 
          onClick={() => window.history.back()}
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', cursor: 'pointer', padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >

          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 auto', transform: 'translateX(-20px)', letterSpacing: '-0.02em' }}>
          My <span style={{ color: 'var(--accent-orange)' }}>Wallet</span>
        </h1>
      </div>

      {/* Mastercard Style Balance Card */}
      <div style={{ padding: '20px 16px 32px' }}>
        <div 
          className="animate-slide-up"
          style={{ 
            background: 'linear-gradient(135deg, #1A1C2E 0%, #2A203F 100%)',
            borderRadius: '28px',
            padding: '24px',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '1.58 / 1',
            width: '100%'
          }}
        >
          {/* Card Textures/Glows */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent-gradient)', opacity: 0.15, filter: 'blur(40px)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', background: '#38BDF8', opacity: 0.1, filter: 'blur(35px)', borderRadius: '50%' }} />
          
          {/* Card Top: Chip and Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ 
                width: '45px', 
                height: '35px', 
                background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)', 
                borderRadius: '8px',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ position: 'absolute', top: '15%', left: '0', width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                <div style={{ position: 'absolute', top: '45%', left: '0', width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                <div style={{ position: 'absolute', top: '75%', left: '0', width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                <div style={{ position: 'absolute', left: '30%', top: '0', width: '1px', height: '100%', background: 'rgba(0,0,0,0.1)' }} />
                <div style={{ position: 'absolute', left: '70%', top: '0', width: '1px', height: '100%', background: 'rgba(0,0,0,0.1)' }} />
              </div>
            </div>
          </div>

          {/* Card Middle: Balance */}
          <div style={{ zIndex: 1, marginTop: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Balance</div>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-orange)', marginRight: '4px' }}>$</span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', lineHeight: 1, color: 'white' }}>
                {Math.floor(balance).toLocaleString()}
                <span style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>.{(balance % 1).toFixed(2).split('.')[1]}</span>
              </h2>
            </div>
          </div>

          {/* Card Bottom: User ID & Mastercard Logo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '4px' }}>USER ID: {displayUserId}</div>
            </div>
            
            <div style={{ position: 'relative', width: '50px', height: '32px' }}>
              <div style={{ position: 'absolute', left: '0', width: '32px', height: '32px', borderRadius: '50%', background: '#EB001B', opacity: 0.9 }} />
              <div style={{ position: 'absolute', right: '0', width: '32px', height: '32px', borderRadius: '50%', background: '#FF5F00', opacity: 0.9 }} />
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '14px', height: '32px', background: 'linear-gradient(90deg, #EB001B 0%, #FF5F00 100%)', opacity: 0.8 }} />
            </div>
          </div>
        </div>

        {/* Action Buttons Below Card */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => setActiveTab('deposit')}
            style={{ 
              flex: 1, 
              padding: '18px', 
              borderRadius: '24px', 
              background: activeTab === 'deposit' ? 'var(--accent-gradient)' : 'var(--glass-bg)',
              border: activeTab === 'deposit' ? 'none' : '1px solid var(--glass-border)',
              color: activeTab === 'deposit' ? 'white' : (isDarkMode ? 'white' : 'var(--text-primary)'),
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: activeTab === 'deposit' ? '0 10px 25px rgba(249, 111, 46, 0.3)' : 'none'
            }}
          >
            <ArrowDownCircle size={20} />
            Deposit
          </button>
          <button 
            onClick={() => setActiveTab('withdraw')}
            style={{ 
              flex: 1, 
              padding: '18px', 
              borderRadius: '24px', 
              background: activeTab === 'withdraw' ? 'var(--accent-gradient)' : 'var(--glass-bg)',
              border: activeTab === 'withdraw' ? 'none' : '1px solid var(--glass-border)',
              color: activeTab === 'withdraw' ? 'white' : (isDarkMode ? 'white' : 'var(--text-primary)'),
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: activeTab === 'withdraw' ? '0 10px 25px rgba(249, 111, 46, 0.3)' : 'none'
            }}
          >
            <ArrowUpCircle size={20} />
            Withdraw
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '0 12px' }}>
        {activeTab === 'deposit' ? (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.01em' }}>Select Gateway</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {localGateways.length === 0 && !isAdminMode && (
                <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '20px', background: 'var(--glass-bg)', borderRadius: '24px', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
                  No payment methods available.
                </div>
              )}

              {localGateways.map((gw: any) => (
                <div key={gw.id} style={{ position: 'relative' }}>
                  <div 
                    onClick={() => setSelectedGateway(gw.id)}
                    style={{
                      background: selectedGateway === gw.id ? `${gw.color}15` : 'var(--glass-bg)',
                      border: '2px solid',
                      borderColor: selectedGateway === gw.id ? gw.color : 'var(--glass-border)',

                      padding: '16px 8px',
                      borderRadius: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '100%'
                    }}
                  >
                    <img src={gw.logo} alt={gw.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{gw.name}</span>
                  </div>
                  
                  {isAdminMode && (
                    <button 
                      onClick={(e) => handleDeleteGateway(e, gw.id)}
                      style={{ 
                        position: 'absolute', 
                        top: '-8px', 
                        right: '-8px', 
                        background: '#EF4444', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: '24px', 
                        height: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        cursor: 'pointer', 
                        zIndex: 20, 
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)', 
                        color: 'white' 
                      }}
                    >
                      <Trash2 size={12} strokeWidth={3} />
                    </button>
                  )}
                </div>
              ))}

              {isAdminMode && (
                <button 
                  onClick={() => setShowAddGateway(true)}
                  style={{
                    background: 'var(--glass-bg)',
                    border: '2px dashed var(--glass-border)',
                    padding: '16px 8px',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>

                    <Plus size={24} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Add New</span>
                </button>
              )}
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.01em' }}>Quick Amount</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
              {[10, 50, 100, 250, 500, 1000].map((amount) => (
                <button 
                  key={amount}
                  onClick={() => handleQuickSelect(amount)}
                  style={{
                    background: depositAmount === amount.toString() ? 'rgba(249, 111, 46, 0.1)' : 'var(--glass-bg)',
                    border: '2px solid',
                    borderColor: depositAmount === amount.toString() ? 'var(--accent-orange)' : 'var(--glass-border)',
                    padding: '16px 0',
                    borderRadius: '20px',
                    color: 'var(--text-primary)',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >

                  ${amount}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Custom Amount</label>

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-orange)' }}>$</span>
                <input 
                  type="number" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount" 
                  style={{
                    width: '100%',
                    background: 'var(--glass-bg)',
                    border: '2px solid var(--glass-border)',
                    borderRadius: '24px',
                    padding: '20px 20px 20px 45px',
                    color: 'var(--text-primary)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button 
              onClick={() => setIsConfirming(true)}
              disabled={!depositAmount || parseFloat(depositAmount) <= 0 || !selectedGateway}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '22px', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 900, marginBottom: '48px', opacity: (!depositAmount || !selectedGateway) ? 0.5 : 1 }}
            >
              {!selectedGateway ? 'SELECT GATEWAY' : 'ADD FUNDS NOW'}
            </button>
          </div>
        ) : (
          <>
            {/* Linked Accounts Section */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>My Linked Accounts</h3>
                <button 
                  onClick={() => setShowAddMethod(true)}
                  style={{ 
                    background: 'rgba(249, 111, 46, 0.1)', 
                    border: 'none', 
                    color: 'var(--accent-orange)', 
                    padding: '8px 16px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <PlusCircle size={14} />
                  Add New
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {savedMethods.map((method: any) => (
                  <div key={method.id} style={{ background: 'var(--glass-bg)', padding: '16px', borderRadius: '20px', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <img src={method.icon} alt={method.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{method.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{method.number}</div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteMethod(e, method.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#EF4444', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

              </div>
            </div>

          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(249, 111, 46, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CreditCard size={40} color="var(--accent-orange)" strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '12px' }}>Withdraw Winnings</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>Select a linked account to receive your winnings.</p>

            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {savedMethods.map((method: any) => (
                <button 
                  key={method.id}
                  onClick={() => setSelectedWithdrawMethod(method.id)}
                  style={{ 
                    background: selectedWithdrawMethod === method.id ? `${method.color}15` : 'var(--glass-bg)', 
                    padding: '16px', 
                    borderRadius: '20px', 
                    border: '1px solid',
                    borderColor: selectedWithdrawMethod === method.id ? method.color : 'var(--glass-border)', 
                    boxShadow: 'var(--card-shadow)',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    cursor: 'pointer',
                    width: '100%',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <img src={method.icon} alt={method.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{method.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{method.number}</div>
                  </div>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: selectedWithdrawMethod === method.id ? method.color : 'var(--glass-border)', background: selectedWithdrawMethod === method.id ? method.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedWithdrawMethod === method.id && <Check size={12} color="white" strokeWidth={4} />}
                  </div>
                </button>

              ))}
              <button 
                onClick={() => setShowAddMethod(true)}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  borderRadius: '20px', 
                  background: 'var(--glass-bg)', 
                  border: '2px dashed var(--glass-border)', 
                  color: 'var(--text-secondary)', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >

                <PlusCircle size={18} />
                Link New Account
              </button>
            </div>

                        <div style={{ position: 'relative', marginBottom: '24px' }}>
              <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-orange)' }}>$</span>
              <input 
                type="number" 
                placeholder="Withdraw amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '20px',
                  padding: '18px 20px 18px 45px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />

              <button 
                onClick={() => setWithdrawAmount(balance.toString())}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(249, 111, 46, 0.1)',
                  border: '1px solid rgba(249, 111, 46, 0.2)',
                  color: 'var(--accent-orange)',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                MAX
              </button>
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={!selectedWithdrawMethod || !withdrawAmount}
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                padding: '20px', 
                borderRadius: '24px', 
                opacity: (!selectedWithdrawMethod || !withdrawAmount) ? 0.5 : 1, 
                cursor: (!selectedWithdrawMethod || !withdrawAmount) ? 'not-allowed' : 'pointer' 
              }}
            >
              REQUEST WITHDRAWAL
            </button>
          </div>
        </>
      )}

        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} color="var(--accent-orange)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>Activity</h3>
            </div>
            <div style={{ display: 'flex', background: 'var(--glass-bg)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <button 
                onClick={() => setHistoryTab('personal')}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '10px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: historyTab === 'personal' ? 'var(--accent-orange)' : 'transparent',
                  color: historyTab === 'personal' ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Personal
              </button>
              <button 
                onClick={() => setHistoryTab('community')}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '10px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  background: historyTab === 'community' ? 'var(--accent-orange)' : 'transparent',
                  color: historyTab === 'community' ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Globe size={12} />
                Community
              </button>
            </div>
          </div>
          
          {historyTab === 'community' ? (
            <div className="animate-fade-in">
              <GlobalActivityFeed />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(() => {
              const userPayments = paymentRequests
                .filter(p => p.userId === displayUserId)
                .map(p => ({
                  id: p.id,
                  type: 'Deposit' as const,
                  amount: p.amount,
                  date: p.timestamp,
                  status: p.status.charAt(0).toUpperCase() + p.status.slice(1) as any
                }));
              
              const userWithdrawals = withdrawalRequests
                .filter(w => w.userId === displayUserId)
                .map(w => ({
                  id: w.id,
                  type: 'Withdraw' as const,
                  amount: -w.amount,
                  date: w.timestamp,
                  status: w.status.charAt(0).toUpperCase() + w.status.slice(1) as any
                }));

              const allTxs = [...userPayments, ...userWithdrawals, ...localTransactions]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

              return allTxs.length > 0 ? allTxs.map((tx) => (
                <div key={tx.id} style={{ 
                  background: 'var(--glass-bg)', 
                  borderRadius: '24px', 
                  padding: '16px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '14px', 
                      background: tx.amount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {tx.amount > 0 ? (
                        <Plus size={20} color="#10B981" strokeWidth={3} />
                      ) : (
                        <Minus size={20} color="#EF4444" strokeWidth={3} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '2px', color: 'var(--text-primary)' }}>{tx.type}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>{tx.date}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontWeight: 900, 
                      fontSize: '1.1rem', 
                      color: tx.amount > 0 ? '#10B981' : 'var(--text-primary)',
                      marginBottom: '2px'
                    }}>
                      {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                    </div>
                    <div style={{ 
                      color: tx.status === 'Completed' || tx.status === 'Approved' ? '#10B981' : tx.status === 'Rejected' ? '#EF4444' : '#F59E0B', 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      textTransform: 'uppercase' 
                    }}>
                      {tx.status}
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--glass-bg)', borderRadius: '24px', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
                  No personal transactions yet.
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>

      {/* Modals */}


      {isConfirming && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setIsConfirming(false)}
        >
          <div 
            className="animate-scale-up"
            style={{
              background: 'var(--modal-bg)',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '40px',
              padding: '24px 16px',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >

            <div style={{ 
              width: '90px', 
              height: '90px', 
              borderRadius: '50%', 
              background: `${localGateways.find((g: any) => g.id === selectedGateway)?.color}15`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px',
              border: `1px solid ${localGateways.find((g: any) => g.id === selectedGateway)?.color}33`
            }}>
              <img src={localGateways.find((g: any) => g.id === selectedGateway)?.logo} style={{ width: '50px' }} alt="" />
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px' }}>Confirm via {localGateways.find((g: any) => g.id === selectedGateway)?.name}</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '40px', lineHeight: 1.6 }}>
              You are adding <span style={{ color: '#10B981', fontWeight: 900 }}>${parseFloat(depositAmount).toLocaleString()}</span> to your wallet using <span style={{ color: localGateways.find((g: any) => g.id === selectedGateway)?.color, fontWeight: 800 }}>{localGateways.find((g: any) => g.id === selectedGateway)?.name}</span>.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={handleDeposit}
                style={{ 
                  width: '100%', 
                  padding: '22px', 
                  borderRadius: '24px', 
                  background: localGateways.find((g: any) => g.id === selectedGateway)?.color, 
                  border: 'none', 
                  color: 'white', 
                  fontWeight: 900, 
                  fontSize: '1.1rem', 
                  cursor: 'pointer', 
                  boxShadow: `0 10px 25px ${localGateways.find((g: any) => g.id === selectedGateway)?.color}33` 
                }}
              >
                CONFIRM & DEPOSIT
              </button>
              <button 
                onClick={() => setIsConfirming(false)}
                style={{ width: '100%', padding: '16px', borderRadius: '24px', background: 'none', border: 'none', color: '#6B7280', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isWithdrawConfirming && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setIsWithdrawConfirming(false)}
        >
          <div 
            className="animate-scale-up"
            style={{
              background: 'var(--modal-bg)',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '40px',
              padding: '24px 16px',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >

            <div style={{ 
              width: '90px', 
              height: '90px', 
              borderRadius: '50%', 
              background: `${savedMethods.find((m: any) => m.id === selectedWithdrawMethod)?.color}15`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px',
              border: `1px solid ${savedMethods.find((m: any) => m.id === selectedWithdrawMethod)?.color}33`
            }}>
              <img src={savedMethods.find((m: any) => m.id === selectedWithdrawMethod)?.icon} style={{ width: '50px' }} alt="" />
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px' }}>Confirm Withdrawal</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '40px', lineHeight: 1.6 }}>
              You are requesting to withdraw <span style={{ color: 'var(--accent-orange)', fontWeight: 900 }}>${parseFloat(withdrawAmount).toLocaleString()}</span> to your <span style={{ color: savedMethods.find((m: any) => m.id === selectedWithdrawMethod)?.color, fontWeight: 800 }}>{savedMethods.find((m: any) => m.id === selectedWithdrawMethod)?.name}</span> account ({savedMethods.find((m: any) => m.id === selectedWithdrawMethod)?.number}).
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={confirmWithdraw}
                style={{ 
                  width: '100%', 
                  padding: '22px', 
                  borderRadius: '24px', 
                  background: 'var(--accent-gradient)', 
                  border: 'none', 
                  color: 'white', 
                  fontWeight: 900, 
                  fontSize: '1.1rem', 
                  cursor: 'pointer', 
                  boxShadow: '0 10px 25px rgba(249, 111, 46, 0.2)' 
                }}
              >
                CONFIRM & WITHDRAW
              </button>
              <button 
                onClick={() => setIsWithdrawConfirming(false)}
                style={{ width: '100%', padding: '16px', borderRadius: '24px', background: 'none', border: 'none', color: '#6B7280', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddGateway && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setShowAddGateway(false)}
        >
          <div 
            className="animate-scale-up"
            style={{
              background: 'var(--modal-bg)',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '40px',
              padding: '24px 16px',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >

            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px' }}>Add <span style={{ color: 'var(--accent-orange)' }}>Gateway</span></h3>
            <p style={{ color: '#9CA3AF', marginBottom: '32px', fontSize: '0.9rem' }}>Configure a new payment provider for users.</p>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4B5563', textAlign: 'left', marginBottom: '12px', paddingLeft: '4px', letterSpacing: '0.05em' }}>QUICK PRESETS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button 
                  onClick={() => addPresetGateway('Bkash', '#E2136E', 'https://raw.githubusercontent.com/ultraDevs/Bangladeshi-Payment-Gateways/master/assets/images/Bkash.png')}
                  style={{ background: 'rgba(226, 19, 110, 0.1)', border: '1px solid rgba(226, 19, 110, 0.2)', padding: '12px 8px', borderRadius: '16px', color: '#E2136E', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  BKASH
                </button>
                <button 
                  onClick={() => addPresetGateway('Nagad', '#F15A22', 'https://raw.githubusercontent.com/ultraDevs/Bangladeshi-Payment-Gateways/master/assets/images/Nagad.png')}
                  style={{ background: 'rgba(241, 90, 34, 0.1)', border: '1px solid rgba(241, 90, 34, 0.2)', padding: '12px 8px', borderRadius: '16px', color: '#F15A22', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  NAGAD
                </button>
                <button 
                  onClick={() => addPresetGateway('Binance', '#F3BA2F', 'https://cryptologos.cc/logos/bnb-bnb-logo.png')}
                  style={{ background: 'rgba(243, 186, 47, 0.1)', border: '1px solid rgba(243, 186, 47, 0.2)', padding: '12px 8px', borderRadius: '16px', color: '#F3BA2F', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  BINANCE
                </button>
              </div>
            </div>

            <div style={{ position: 'relative', height: '1px', background: 'var(--glass-border)', margin: '0 0 24px' }}>
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--modal-bg)', padding: '0 12px', color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 800 }}>OR CUSTOM</span>
            </div>


            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>GATEWAY NAME</label>
                <input 
                  type="text" 
                  value={newGateway.name}
                  onChange={(e) => setNewGateway({...newGateway, name: e.target.value})}
                  placeholder="e.g. Upay" 
                  style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '16px', color: 'var(--text-primary)', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>LOGO URL</label>
                <input 
                  type="text" 
                  value={newGateway.logo}
                  onChange={(e) => setNewGateway({...newGateway, logo: e.target.value})}
                  placeholder="https://..." 
                  style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '16px', color: 'var(--text-primary)', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 700, display: 'block', marginBottom: '8px' }}>THEME COLOR</label>
                <input 
                  type="color" 
                  value={newGateway.color}
                  onChange={(e) => setNewGateway({...newGateway, color: e.target.value})}
                  style={{ width: '100%', height: '50px', background: 'none', border: 'none', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={handleAddGateway}
                style={{ width: '100%', padding: '18px', borderRadius: '24px', background: 'var(--accent-gradient)', border: 'none', color: 'white', fontWeight: 900, cursor: 'pointer' }}
              >
                ADD PAYMENT METHOD
              </button>
              <button 
                onClick={() => setShowAddGateway(false)}
                style={{ width: '100%', padding: '12px', borderRadius: '24px', background: 'none', border: 'none', color: '#6B7280', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Saved Method Modal */}
      {showAddMethod && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setShowAddMethod(false)}
        >
          <div 
            className="animate-scale-up"
            style={{
              background: 'var(--modal-bg)',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '40px',
              padding: '24px 16px',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >

            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px' }}>Link <span style={{ color: 'var(--accent-orange)' }}>Account</span></h3>
            <p style={{ color: '#9CA3AF', marginBottom: '32px' }}>Link your Bkash, Nagad or Binance for quick payments.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <select 
                value={newMethodData.name}
                onChange={(e) => setNewMethodData({...newMethodData, name: e.target.value})}
                style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '16px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', outline: 'none' }}
              >
                <option value="" style={{ background: 'var(--modal-bg)', color: 'var(--text-primary)' }}>Select Provider</option>
                <option value="Bkash" style={{ background: 'var(--modal-bg)', color: 'var(--text-primary)' }}>Bkash</option>
                <option value="Nagad" style={{ background: 'var(--modal-bg)', color: 'var(--text-primary)' }}>Nagad</option>
                <option value="Binance" style={{ background: 'var(--modal-bg)', color: 'var(--text-primary)' }}>Binance</option>
              </select>

              <input 
                type="text" 
                placeholder="Enter account number"
                value={newMethodData.number}
                onChange={(e) => setNewMethodData({...newMethodData, number: e.target.value})}
                style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '16px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', outline: 'none' }}
              />

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={handleAddMethod}
                style={{ width: '100%', padding: '18px', borderRadius: '24px', background: 'var(--accent-gradient)', border: 'none', color: 'white', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}
              >
                LINK ACCOUNT
              </button>
              <button 
                onClick={() => setShowAddMethod(false)}
                style={{ width: '100%', padding: '12px', borderRadius: '24px', background: 'none', border: 'none', color: '#6B7280', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(16px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setDeleteConfirmation(null)}
        >
          <div 
            className="animate-scale-up"
            style={{
              background: 'var(--modal-bg)',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '40px',
              padding: '24px 16px',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'rgba(239, 68, 68, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px',
              color: '#EF4444'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
              </svg>
            </div>
            
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '12px' }}>Confirm Deletion</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
              Are you sure you want to remove this {deleteConfirmation.type === 'gateway' ? 'payment gateway' : 'linked account'}? This action cannot be undone.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={confirmDelete}
                style={{ 
                  width: '100%', 
                  padding: '18px', 
                  borderRadius: '24px', 
                  background: '#EF4444', 
                  border: 'none', 
                  color: 'white', 
                  fontWeight: 900, 
                  fontSize: '1.1rem', 
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)'
                }}
              >
                DELETE NOW
              </button>
              <button 
                onClick={() => setDeleteConfirmation(null)}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '24px', 
                  background: 'var(--glass-bg)', 
                  border: '1px solid var(--glass-border)', 
                  color: 'var(--text-primary)', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Wallet;

