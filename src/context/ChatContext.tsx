import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser } from '../data/mockData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: string;
  avatar?: string;
  userName?: string;
  status?: 'sending' | 'sent';
}

interface ChatContextType {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  messages: Message[];
  sendMessage: (text: string, sender: 'user' | 'support') => void;
  clearMessages: () => void;
  isTyping: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_messages');
    return saved ? JSON.parse(saved) : [
      { 
        id: '1', 
        text: 'Welcome to BIDI BET Support! How can we help you today?', 
        sender: 'support', 
        time: '12:00 PM',
        userName: 'Support Bot',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Support',
        status: 'sent'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  const botReplies = [
    "Thank you for your message! Our live gaming support supervisor has been alerted and will join this thread shortly.",
    "I understand. Let me check your account details. Could you please share your registered email or username?",
    "We are currently upgrading our payment gateways to support faster transaction clearing. Are you waiting for a deposit or withdrawal?",
    "Your ticket is active! If this is regarding a prize pool distribution, please send a screenshot of the match result page.",
    "For security reasons, please do not share your password. Our official support team will never ask for your account password."
  ];

  const getSmartReply = (userText: string): string => {
    const text = userText.toLowerCase();
    if (text.includes('wallet') || text.includes('deposit') || text.includes('withdraw') || text.includes('money') || text.includes('balance')) {
      return "Deposits and withdrawals are processed within 5-15 minutes automatically. If you've been waiting longer, please reply with your Transaction ID.";
    }
    if (text.includes('prize') || text.includes('win') || text.includes('winner') || text.includes('pool') || text.includes('1st')) {
      return "Match prize distributions are processed within 10 minutes of the match completion. If you won, the balance is added directly to your Wallet.";
    }
    if (text.includes('admin') || text.includes('owner') || text.includes('live') || text.includes('human')) {
      return "Sure! I'm transferring your request to a human support representative. Please hold on for a moment...";
    }
    return botReplies[Math.floor(Math.random() * botReplies.length)];
  };

  const sendMessage = (text: string, sender: 'user' | 'support') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: sender === 'user' ? currentUser.avatar : 'https://api.dicebear.com/7.x/bottts/svg?seed=Support',
      userName: sender === 'user' ? currentUser.name : 'Support Bot',
      status: sender === 'user' ? 'sending' : 'sent'
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate network delivery delay for user message
    if (sender === 'user') {
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'sent' } : m));
      }, 500);

      // Trigger automatic typing bot reply
      const replyText = getSmartReply(text);
      
      // Start typing simulation after 700ms (after user message is marked as sent)
      setTimeout(() => {
        setIsTyping(true);
      }, 700);

      // Add actual reply and end typing after 2400ms (1.7s of typing indicator showing)
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => {
          // Check if the last message is still a user message (to avoid interrupting if admin has since replied)
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.sender === 'user') {
            return [...prev, {
              id: (Date.now() + 1).toString(),
              text: replyText,
              sender: 'support',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              userName: 'Support Bot',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Support',
              status: 'sent'
            }];
          }
          return prev;
        });
      }, 2400);
    }
  };

  const clearMessages = () => {
    setMessages([
      { 
        id: '1', 
        text: 'Welcome to BIDI BET Support! How can we help you today?', 
        sender: 'support', 
        time: '12:00 PM',
        userName: 'Support Bot',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Support'
      }
    ]);
  };

  return (
    <ChatContext.Provider value={{ isChatOpen, setIsChatOpen, messages, sendMessage, clearMessages, isTyping }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
