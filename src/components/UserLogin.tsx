import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';
import { Phone, Lock, ArrowLeft, LogIn } from 'lucide-react';

interface UserLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

const IMAGES = {
  pen: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/abaab5c5-7b94-420d-bdbd-8e4e5cb0d4a6/1774146098874_pngtree-pen-3d-png-image_13125066.png',
  question: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/abaab5c5-7b94-420d-bdbd-8e4e5cb0d4a6/1774146112037_signo-de-interrogacion-3d-icon-png-download-4347244.png',
};

const UserLogin: React.FC<UserLoginProps> = ({ onSuccess, onBack }) => {
  const { users, setCurrentUser } = useStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error('Please enter both phone and password');
      return;
    }
    const user = users.find(u => u.phone === phone && u.password === password);
    if (user) {
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.fullName}`);
      onSuccess();
    } else {
      toast.error('Invalid Phone Number or Password');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-slate-950 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.img
          src={IMAGES.question}
          className="absolute top-20 right-[15%] w-40 h-40 opacity-10 filter blur-[2px]"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 20, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.img
          src={IMAGES.pen}
          className="absolute bottom-20 left-[10%] w-56 h-56 opacity-10 filter blur-[3px]"
          animate={{
            y: [0, 40, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md p-10 bg-slate-900/60 border border-white/5 rounded-[3rem] backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] relative z-10"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-10 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-sm font-bold tracking-widest uppercase">Go Back</span>
        </button>

        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
            <LogIn className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">STUDENT ACCESS</h2>
          <p className="text-slate-400 text-sm font-medium">Please enter your login details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full pl-14 pr-6 py-5 bg-slate-950/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-14 pr-6 py-5 bg-slate-950/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
          >
            LOGIN TO DASHBOARD
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserLogin;