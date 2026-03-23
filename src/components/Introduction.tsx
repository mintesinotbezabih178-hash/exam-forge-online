import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, ShieldCheck } from 'lucide-react';

interface IntroductionProps {
  onOwnerClick: () => void;
  onUserClick: () => void;
}

const IMAGES = {
  // Updated main icon as requested
  mainIcon: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/abaab5c5-7b94-420d-bdbd-8e4e5cb0d4a6/1774309379297_3d-floating-education-icons-with-open-book-backpack-graduation-cap_56104-3096.png',
  // Reintroduced pen image
  pen: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/abaab5c5-7b94-420d-bdbd-8e4e5cb0d4a6/1774146098874_pngtree-pen-3d-png-image_13125066.png',
  question: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/abaab5c5-7b94-420d-bdbd-8e4e5cb0d4a6/1774146112037_signo-de-interrogacion-3d-icon-png-download-4347244.png',
  bg: 'https://storage.googleapis.com/dala-prod-public-storage/attachments/abaab5c5-7b94-420d-bdbd-8e4e5cb0d4a6/1774145915814_retouch_2026011522210548__5_.png'
};

const Introduction: React.FC<IntroductionProps> = ({ onOwnerClick, onUserClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden bg-slate-950"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${IMAGES.bg})`,
          filter: 'brightness(0.5) contrast(1.2)'
        }}
      />

      {/* Decorative Overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-tr from-slate-950 via-transparent to-slate-950/40" />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-2 pointer-events-none">
        <motion.img
          src={IMAGES.question}
          alt="Decoration Question"
          className="absolute top-[15%] left-[10%] w-24 h-24 opacity-30 md:opacity-40"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Reintroduced Pen Image with Animation */}
        <motion.img
          src={IMAGES.pen}
          alt="Decoration Pen"
          className="absolute top-[20%] right-[10%] w-32 h-32 opacity-40 md:opacity-60 z-10"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 20, -10, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.img
          src={IMAGES.question}
          alt="Decoration Question"
          className="absolute bottom-[20%] right-[15%] w-32 h-32 opacity-20 md:opacity-30"
          animate={{
            y: [0, 25, 0],
            rotate: [0, -10, 10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.img
          src={IMAGES.pen}
          alt="Decoration Pen"
          className="absolute bottom-[15%] left-[15%] w-20 h-20 opacity-30 md:opacity-40"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -15, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-5xl w-full">
        {/* Central Circular Animated Icon - Now the New Education Icon */}
        <div className="relative w-48 h-48 sm:w-72 sm:h-72 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full" />
          
          <motion.div
            animate={{
              x: [0, 20, 0, -20, 0],
              y: [-20, 0, 20, 0, -20],
              rotate: [0, 5, 10, 5, 0, -5, -10, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="relative z-20 w-full h-full"
          >
            <motion.img
              src={IMAGES.mainIcon}
              alt="Beka Icon"
              className="w-full h-full object-contain filter drop-shadow-[0_25px_40px_rgba(79,70,229,0.5)]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </motion.div>
        </div>

        <div className="space-y-4 w-full">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] break-words leading-none"
          >
            Beka Online Exam
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-300 text-xl font-bold uppercase tracking-[0.3em] drop-shadow-md"
          >
            Shape Your Future
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-lg px-6"
        >
          <button
            onClick={onUserClick}
            className="group relative flex items-center justify-center gap-4 px-12 py-6 bg-white text-indigo-950 hover:bg-indigo-50 rounded-3xl font-black text-xl transition-all shadow-[0_20px_40px_rgba(255,255,255,0.15)] active:scale-95 flex-1 overflow-hidden"
          >
            <LogIn className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
            LOGIN
          </button>
          
          <button
            onClick={onOwnerClick}
            className="group relative flex items-center justify-center gap-4 px-12 py-6 bg-indigo-950/40 hover:bg-indigo-900/60 text-white backdrop-blur-2xl rounded-3xl font-black text-xl border-2 border-white/10 transition-all shadow-2xl active:scale-95 flex-1"
          >
            <ShieldCheck className="w-7 h-7 group-hover:scale-110 transition-transform" />
            OWNER
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 text-center">
        <span className="text-white/30 text-xs font-black tracking-widest uppercase">
          Digital Learning Portal &copy; 2024
        </span>
      </div>
    </motion.div>
  );
};

export default Introduction;