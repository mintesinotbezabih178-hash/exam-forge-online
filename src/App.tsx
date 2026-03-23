import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import Introduction from './components/Introduction';
import OwnerAuth from './components/OwnerAuth';
import OwnerDashboard from './components/OwnerDashboard';
import UserLogin from './components/UserLogin';
import UserDashboard from './components/UserDashboard';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  const [view, setView] = useState<'intro' | 'owner-auth' | 'owner-dash' | 'user-login' | 'user-dash'>('intro');
  const { isOwnerLoggedIn, currentUser } = useStore();

  const handleOwnerClick = () => {
    if (isOwnerLoggedIn) {
      setView('owner-dash');
    } else {
      setView('owner-auth');
    }
  };

  const handleUserClick = () => {
    if (currentUser) {
      setView('user-dash');
    } else {
      setView('user-login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden font-sans selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <Introduction
            key="intro"
            onOwnerClick={handleOwnerClick}
            onUserClick={handleUserClick}
          />
        )}
        {view === 'owner-auth' && (
          <OwnerAuth
            key="owner-auth"
            onSuccess={() => setView('owner-dash')}
            onBack={() => setView('intro')}
          />
        )}
        {view === 'owner-dash' && (
          <OwnerDashboard
            key="owner-dash"
            onLogout={() => setView('intro')}
          />
        )}
        {view === 'user-login' && (
          <UserLogin
            key="user-login"
            onSuccess={() => setView('user-dash')}
            onBack={() => setView('intro')}
          />
        )}
        {view === 'user-dash' && (
          <UserDashboard
            key="user-dash"
            onLogout={() => setView('intro')}
          />
        )}
      </AnimatePresence>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default App;