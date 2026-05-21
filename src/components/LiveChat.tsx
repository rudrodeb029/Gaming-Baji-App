import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useLocation } from 'react-router-dom';

const LiveChat = () => {
  const { isChatOpen, setIsChatOpen, messages, sendMessage } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(inputMessage, 'user');
    setInputMessage('');
  };

  const location = useLocation();
  const hiddenPaths = ['/', '/onboarding', '/auth', '/admin', '/admin/dashboard'];
  const isHidden = hiddenPaths.some(path => location.pathname === path || (path !== '/' && location.pathname.startsWith(path)));

  if (isHidden) return null;

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '22px',
          background: 'var(--accent-gradient)',
          border: 'none',
          boxShadow: '0 10px 30px rgba(227, 67, 96, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isChatOpen ? 'rotate(90deg)' : 'none'
        }}
      >
        {isChatOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div
          className="animate-slide-up"
          style={{
            position: 'fixed',
            bottom: '180px',
            right: '24px',
            width: 'calc(100% - 48px)',
            maxWidth: '400px',
            height: '500px',
            maxHeight: '70vh',
            background: 'var(--bg-dark)',
            backdropFilter: 'blur(20px)',
            borderRadius: '32px',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '24px', 
            background: 'var(--glass-bg)', 
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Live Support</div>
                <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>Always Online</div>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{ 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ 
                  background: msg.sender === 'user' ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                  boxShadow: msg.sender === 'user' ? '0 5px 15px rgba(227, 67, 96, 0.2)' : 'none'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage}
            style={{ 
              padding: '20px', 
              background: 'var(--glass-bg)', 
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              gap: '12px'
            }}
          >
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'var(--accent-gradient)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 5px 15px rgba(227, 67, 96, 0.3)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default LiveChat;
