import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';
import { KeyRound, ArrowLeft } from 'lucide-react';

interface OwnerAuthProps {
  onSuccess: () => void;
  onBack: () => void;
}

const OwnerAuth: React.FC<OwnerAuthProps> = ({ onSuccess, onBack }) => {
  const { owner, setOwnerLoggedIn } = useStore();
  const [ownerId, setOwnerId] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerId === owner.id && phone === owner.phone) {
      setOwnerLoggedIn(true);
      toast.success('Owner access granted');
      onSuccess();
    } else {
      toast.error('Invalid Owner ID or Phone Number');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <div className="w-full max-w-md p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-black">Owner Login</h2>
          <p className="text-slate-500 text-sm">Restricted Area</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Owner ID</label>
            <input
              type="password"
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              placeholder="Enter Owner ID"
              className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0900000000"
              className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default OwnerAuth;