import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser } from '../data/mockData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: string;
  avatar?: string;
  userName?: string;
}

interface ChatContextType {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  messages: Message[];
  sendMessage: (text: string, sender: 'user' | 'support') => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_messages');
    return saved ? JSON.parse(saved) : [
      { 
        id: '1', 
        text: 'Welcome to BIDI BET Support! How can we help you today?', 
        sender: 'support', 
        time: '12:00 PM',
        userName: 'Support Bot'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  const [hasAutoReplied, setHasAutoReplied] = useState(false);

  const sendMessage = (text: string, sender: 'user' | 'support') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: sender === 'user' ? currentUser.avatar : 'https://upload.wikimedia.org/wikipedia/en/3/36/Free_Fire_logo.png',
      userName: sender === 'user' ? currentUser.name : 'Support'
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulated auto-response for user messages if not in admin mode
    if (sender === 'user' && !hasAutoReplied) {
      setHasAutoReplied(true);
      setTimeout(() => {
        setMessages(prev => {
          // Check if the last message is still a user message (to avoid interrupting if admin has since replied)
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.sender === 'user') {
            return [...prev, {
              id: (Date.now() + 1).toString(),
              text: "Thanks for reaching out! Our team has been notified and will get back to you shortly.",
              sender: 'support',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              userName: 'Support Bot'
            }];
          }
          return prev;
        });
      }, 3000);
    }
  };

  const clearMessages = () => {
    setMessages([
      { 
        id: '1', 
        text: 'Welcome to BIDI BET Support! How can we help you today?', 
        sender: 'support', 
        time: '12:00 PM',
        userName: 'Support Bot'
      }
    ]);
  };

  return (
    <ChatContext.Provider value={{ isChatOpen, setIsChatOpen, messages, sendMessage, clearMessages }}>
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
