import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Question, Exam } from '../store/useStore';
import { toast } from 'sonner';
import {
  Users,
  PlusCircle,
  FileText,
  Settings,
  LogOut,
  UserPlus,
  BarChart3,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Edit2,
  BookOpen,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';

interface OwnerDashboardProps {
  onLogout: () => void;
}

const ExamReadModal: React.FC<{ exam: Exam; onClose: () => void }> = ({ exam, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h3 className="text-xl font-black text-white">{exam.title}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{exam.durationMinutes} Minutes • {exam.questions.length} Questions</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            {exam.questions.map((q, idx) => (
              <div key={q.id} className="space-y-4 p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <div className="flex gap-4">
                  <span className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center font-black shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-lg font-bold text-white">{q.text}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
                  {q.options.map((opt, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    const isCorrect = letter === q.correctAnswer;
                    return (
                      <div 
                        key={oIdx} 
                        className={`p-3 rounded-xl border text-sm flex items-center justify-between ${
                          isCorrect ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="font-bold mr-2">{letter}. {opt}</span>
                        {isCorrect && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all text-sm"
          >
            Close Preview
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onLogout }) => {
  const {
    owner,
    setOwner,
    users,
    addUser,
    exams,
    addExam,
    updateExam,
    deleteExam,
    publishExam,
    showResults,
    togglePublishResults,
    setOwnerLoggedIn
  } = useStore();

  const [activeTab, setActiveTab] = useState<'users' | 'exams' | 'results' | 'create-exam' | 'profile'>('users');

  // Register User State
  const [newUser, setNewUser] = useState({ fullName: '', phone: '', password: '' });

  // Create/Edit Exam State
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState('');
  const [examDuration, setExamDuration] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState({ text: '', options: ['', '', '', ''], correctAnswer: 'A' });

  // Read Exam State
  const [readingExam, setReadingExam] = useState<Exam | null>(null);

  // Profile Edit State
  const [editOwner, setEditOwner] = useState({ id: owner.id, phone: owner.phone });

  // Show password toggle state for users
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.fullName && newUser.phone && newUser.password) {
      addUser({
        id: Math.random().toString(36).substr(2, 9),
        ...newUser,
        results: []
      });
      setNewUser({ fullName: '', phone: '', password: '' });
      toast.success('User registered successfully');
    }
  };

  const handleAddQuestion = () => {
    if (!currentQ.text || currentQ.options.some(opt => !opt)) {
      toast.error('Please fill all question fields');
      return;
    }
    const q: Question = {
      id: Math.random().toString(36).substr(2, 9),
      ...currentQ
    };
    setQuestions([...questions, q]);
    setCurrentQ({ text: '', options: ['', '', '', ''], correctAnswer: 'A' });
    toast.success('Question added to exam');
  };

  const handleSaveExam = (sendToAll = false) => {
    if (!examTitle || questions.length === 0) {
      toast.error('Title and questions required');
      return;
    }

    if (editingExamId) {
      const updatedExam: Exam = {
        id: editingExamId,
        title: examTitle,
        questions,
        durationMinutes: examDuration,
        isPublished: sendToAll,
        createdAt: exams.find(e => e.id === editingExamId)?.createdAt || Date.now()
      };
      updateExam(updatedExam);
      toast.success(sendToAll ? 'Exam updated and published!' : 'Exam changes saved');
    } else {
      const newExam: Exam = {
        id: Math.random().toString(36).substr(2, 9),
        title: examTitle,
        questions,
        durationMinutes: examDuration,
        isPublished: sendToAll,
        createdAt: Date.now()
      };
      addExam(newExam);
      toast.success(sendToAll ? 'Exam published to users!' : 'Exam saved successfully');
    }

    resetExamForm();
    setActiveTab('exams');
  };

  const resetExamForm = () => {
    setEditingExamId(null);
    setExamTitle('');
    setQuestions([]);
    setExamDuration(60);
    setCurrentQ({ text: '', options: ['', '', '', ''], correctAnswer: 'A' });
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExamId(exam.id);
    setExamTitle(exam.title);
    setQuestions(exam.questions);
    setExamDuration(exam.durationMinutes);
    setActiveTab('create-exam');
    toast.info('Editing Exam: ' + exam.title);
  };

  const handleUpdateProfile = () => {
    setOwner(editOwner);
    toast.success('Profile updated successfully');
  };

  const logout = () => {
    setOwnerLoggedIn(false);
    onLogout();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      <AnimatePresence>
        {readingExam && <ExamReadModal exam={readingExam} onClose={() => setReadingExam(null)} />}
      </AnimatePresence>

      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl shrink-0">
        <h2 className="text-xl font-black tracking-tight text-indigo-500 uppercase">Beka Online Owner</h2>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Owner Active
          </div>
          <button onClick={logout} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-4">
        <div className="max-w-4xl mx-auto h-full overflow-y-auto no-scrollbar pb-24">
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400">
                  <UserPlus className="w-5 h-5" /> Register New User
                </h3>
                <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="bg-slate-800 border-slate-700 rounded-xl px-4 py-3 outline-none"
                    value={newUser.fullName}
                    onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    className="bg-slate-800 border-slate-700 rounded-xl px-4 py-3 outline-none"
                    value={newUser.phone}
                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="bg-slate-800 border-slate-700 rounded-xl px-4 py-3 outline-none"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <button type="submit" className="sm:col-span-3 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
                    Register User
                  </button>
                </form>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 flex flex-col">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400">
                  <Users className="w-5 h-5" /> View User Information
                </h3>
                <div className="space-y-3">
                  {users.map((u) => (
                    <div key={u.id} className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-black text-lg text-white group-hover:text-indigo-400 transition-colors">{u.fullName}</p>
                          <span className="text-[10px] font-mono text-slate-500 tracking-wider">ID: {u.id}</span>
                        </div>
                        <button 
                          onClick={() => togglePasswordVisibility(u.id)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                          {visiblePasswords[u.id] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/50">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone Number</span>
                          <p className="text-indigo-300 font-mono font-bold">{u.phone}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Password</span>
                          <p className={`font-mono font-bold transition-all duration-300 ${visiblePasswords[u.id] ? 'text-indigo-300' : 'text-slate-600 blur-[4px] select-none'}`}>
                            {u.password}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-12">
                      <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-slate-500 font-bold">No users registered yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'create-exam' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                    {editingExamId ? <Edit2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                    {editingExamId ? 'Edit Exam' : 'Create New Exam'}
                  </h3>
                  {editingExamId && (
                    <button 
                      onClick={resetExamForm}
                      className="text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Exam Title</label>
                    <input
                      type="text"
                      placeholder="Enter Exam Title"
                      className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 outline-none"
                      value={examTitle}
                      onChange={e => setExamTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Duration (Mins)</label>
                    <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-3 border border-slate-700">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        className="bg-transparent border-none outline-none w-full font-mono font-bold"
                        value={examDuration}
                        onChange={e => setExamDuration(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Add Question #{questions.length + 1}</p>
                    <span className="text-[10px] text-indigo-500 font-bold px-2 py-1 bg-indigo-500/10 rounded-md">Questions: {questions.length}</span>
                  </div>
                  <textarea
                    placeholder="Enter your question here"
                    className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 outline-none min-h-[100px] text-lg font-medium"
                    value={currentQ.text}
                    onChange={e => setCurrentQ({ ...currentQ, text: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map((opt, idx) => (
                      <div key={opt} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                        <label className="text-indigo-400 font-black w-4">{opt}</label>
                        <input
                          type="text"
                          placeholder={`Option ${opt}`}
                          className="w-full bg-transparent border-none outline-none text-sm"
                          value={currentQ.options[idx]}
                          onChange={e => {
                            const newOpts = [...currentQ.options];
                            newOpts[idx] = e.target.value;
                            setCurrentQ({ ...currentQ, options: newOpts });
                          }}
                        />
                        <input
                          type="radio"
                          name="correct"
                          checked={currentQ.correctAnswer === opt}
                          onChange={() => setCurrentQ({ ...currentQ, correctAnswer: opt })}
                          className="accent-indigo-500 w-5 h-5"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleAddQuestion}
                    className="w-full py-4 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                  >
                    Add Question to List
                  </button>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleSaveExam(false)}
                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl font-black text-slate-300 transition-all"
                  >
                    {editingExamId ? 'UPDATE DRAFT' : 'SAVE AS DRAFT'}
                  </button>
                  <button
                    onClick={() => handleSaveExam(true)}
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
                  >
                    {editingExamId ? 'UPDATE & PUBLISH' : 'SEND TO STUDENTS'}
                  </button>
                </div>
              </div>

              {questions.length > 0 && (
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                  <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Question Preview ({questions.length})</h4>
                  <div className="space-y-4">
                    {questions.map((q, i) => (
                      <div key={q.id} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 w-6 h-6 flex items-center justify-center rounded-md">{i + 1}</span>
                          <p className="text-sm font-medium line-clamp-1">{q.text}</p>
                        </div>
                        <button 
                          onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}
                          className="text-red-500/50 hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'exams' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-2xl font-black">Manage Exams</h3>
                <div className="flex items-center gap-3 bg-indigo-500/10 px-4 py-2.5 rounded-2xl border border-indigo-500/20">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Publish Results</span>
                  <Switch checked={showResults} onCheckedChange={togglePublishResults} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {exams.map(exam => (
                  <div key={exam.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between group hover:border-indigo-500/30 transition-all gap-6">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform group-hover:bg-indigo-500 group-hover:text-white">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-lg">{exam.title}</h4>
                        <div className="flex flex-wrap gap-4 text-[10px] text-slate-500 mt-2 uppercase font-black tracking-widest">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-indigo-400" /> {exam.questions.length} Questions</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-indigo-400" /> {exam.durationMinutes} Mins</span>
                          <span className={exam.isPublished ? "text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md" : "text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md"}>
                            {exam.isPublished ? "Live" : "Draft"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800">
                      <button 
                        onClick={() => setReadingExam(exam)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all font-bold text-xs"
                        title="Read Exam"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="sm:hidden">READ</span>
                      </button>
                      <button 
                        onClick={() => handleEditExam(exam)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl transition-all font-bold text-xs border border-indigo-500/20"
                        title="Edit Exam"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="sm:hidden">EDIT</span>
                      </button>
                      {!exam.isPublished && (
                        <button 
                          onClick={() => publishExam(exam.id)} 
                          className="p-2.5 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                          title="Publish"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteExam(exam.id)} 
                        className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {exams.length === 0 && (
                  <div className="text-center py-24 bg-slate-900/40 rounded-[40px] border border-dashed border-slate-800 text-slate-600">
                    <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-10 h-10 opacity-20" />
                    </div>
                    <p className="font-black text-xl mb-2">No Exams Created</p>
                    <p className="text-sm font-bold opacity-60">Start by creating your first exam draft.</p>
                    <button 
                      onClick={() => setActiveTab('create-exam')}
                      className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-white transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                    >
                      Create New Exam
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'results' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-indigo-500" /> Performance
              </h3>
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-800/80 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-6 py-5">Student</th>
                        <th className="px-6 py-5">Exam</th>
                        <th className="px-6 py-5">Score</th>
                        <th className="px-6 py-5 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {users.flatMap(user => user.results.map(res => ({ ...res, userName: user.fullName, userId: user.id }))).map((res, i) => (
                        <tr key={i} className="hover:bg-indigo-500/5 transition-colors group">
                          <td className="px-6 py-5">
                            <span className="font-black text-white group-hover:text-indigo-400 transition-colors">{res.userName}</span>
                          </td>
                          <td className="px-6 py-5 text-slate-400 font-bold text-xs uppercase">{exams.find(e => e.id === res.examId)?.title || 'Deleted Exam'}</td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${res.score >= res.total / 2 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {res.score} / {res.total}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-[10px] font-black text-slate-500 text-right uppercase tracking-tighter">
                            {new Date(res.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {users.every(u => u.results.length === 0) && (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center text-slate-600">
                            <div className="flex flex-col items-center gap-4">
                              <BarChart3 className="w-12 h-12 opacity-10" />
                              <p className="font-black">No performance data available yet.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-slate-900/40 p-8 rounded-[40px] border border-slate-800 max-w-md mx-auto shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                
                <div className="text-center mb-10 relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[32px] mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20 transform group-hover:rotate-6 transition-transform">
                    <Settings className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter">Owner Portal</h3>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-2">Credential Management</p>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Identifier</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono font-bold text-indigo-400"
                      value={editOwner.id}
                      onChange={e => setEditOwner({ ...editOwner, id: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Emergency Contact</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono font-bold text-indigo-400"
                      value={editOwner.phone}
                      onChange={e => setEditOwner({ ...editOwner, phone: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleUpdateProfile}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-white transition-all shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    SAVE MODIFICATIONS
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-2xl border-t border-slate-800/50 px-6 py-3 pb-8 flex justify-around items-center z-40">
        <NavButton active={activeTab === 'users'} icon={<Users className="w-6 h-6" />} label="Users" onClick={() => setActiveTab('users')} />
        <NavButton active={activeTab === 'exams'} icon={<FileText className="w-6 h-6" />} label="Exams" onClick={() => setActiveTab('exams')} />
        <div className="relative">
          <NavButton 
            active={activeTab === 'create-exam'} 
            icon={<PlusCircle className="w-7 h-7" />} 
            label={editingExamId ? "Editing" : "Create"} 
            onClick={() => setActiveTab('create-exam')} 
          />
          {editingExamId && <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-900 animate-pulse" />}
        </div>
        <NavButton active={activeTab === 'results'} icon={<BarChart3 className="w-6 h-6" />} label="Stats" onClick={() => setActiveTab('results')} />
        <NavButton active={activeTab === 'profile'} icon={<Settings className="w-6 h-6" />} label="Config" onClick={() => setActiveTab('profile')} />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 p-2 transition-all duration-300 ${active ? 'text-indigo-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
  >
    <div className={`p-2 rounded-xl transition-all ${active ? 'bg-indigo-500/10' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
  </button>
);

export default OwnerDashboard;