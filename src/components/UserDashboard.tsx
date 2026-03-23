import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Exam, UserResult } from '../store/useStore';
import { toast } from 'sonner';
import {
  Bell,
  Trophy,
  LogOut,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  HelpCircle,
  FileBarChart
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface UserDashboardProps {
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const { currentUser, setCurrentUser, exams, showResults, updateUser } = useStore();
  const [view, setView] = useState<'home' | 'exam-list' | 'exam-running' | 'results'>('home');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Exam Running State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer: any;
    if (view === 'exam-running' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft]);

  const startExam = (exam: Exam) => {
    // Shuffle questions to avoid cheating as requested
    const shuffledQuestions = [...exam.questions].sort(() => Math.random() - 0.5);
    setSelectedExam({ ...exam, questions: shuffledQuestions });
    setTimeLeft(exam.durationMinutes * 60);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setView('exam-running');
  };

  const handleFinalSubmit = () => {
    if (!selectedExam || !currentUser) return;

    let score = 0;
    let correct = 0;
    let missed = 0;

    selectedExam.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
        correct++;
      } else {
        missed++;
      }
    });

    const result: UserResult = {
      examId: selectedExam.id,
      score,
      total: selectedExam.questions.length,
      correct,
      missed,
      submittedAt: Date.now()
    };

    const updatedUser = {
      ...currentUser,
      results: [...currentUser.results, result]
    };

    updateUser(updatedUser);
    setView('home');
    setSelectedExam(null);
    toast.success('Exam submitted successfully!');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeExams = exams.filter(e => e.isPublished);
  const userResults = currentUser?.results || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Banner */}
      <header className="px-6 py-8 bg-indigo-600 rounded-b-[3rem] shadow-2xl shadow-indigo-500/20">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black">Beka Online Exam</h1>
            <p className="text-indigo-100 mt-2 font-medium opacity-80 uppercase tracking-widest text-xs">
              Welcome, {currentUser?.fullName}
            </p>
          </div>
          <button onClick={() => { setCurrentUser(null); onLogout(); }} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 -mt-6">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DashboardCard
                  icon={<Bell className="w-8 h-8" />}
                  label="Notification"
                  count={activeExams.length}
                  onClick={() => setView('exam-list')}
                  color="bg-amber-500"
                />
                <DashboardCard
                  icon={<Trophy className="w-8 h-8" />}
                  label="Results"
                  onClick={() => setView('results')}
                  color="bg-emerald-500"
                />
              </div>

              <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 text-center py-12">
                <div className="w-20 h-20 bg-indigo-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                  <HelpCircle className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ready for your next challenge?</h3>
                <p className="text-slate-500 text-sm mb-6">Check your notifications for new exams assigned by your teacher.</p>
                <button
                  onClick={() => setView('exam-list')}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                >
                  View Available Exams
                </button>
              </div>
            </motion.div>
          )}

          {view === 'exam-list' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-400 mb-2">
                <ChevronLeft className="w-4 h-4" /> Back to Home
              </button>
              <h2 className="text-2xl font-bold">New Exams</h2>
              <div className="space-y-3">
                {activeExams.map(exam => (
                  <div key={exam.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between group">
                    <div>
                      <h4 className="font-bold text-lg">{exam.title}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3" /> {exam.durationMinutes} Minutes • {exam.questions.length} Questions
                      </p>
                    </div>
                    <button
                      onClick={() => startExam(exam)}
                      className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                ))}
                {activeExams.length === 0 && (
                  <div className="text-center py-20 text-slate-600">No new exams at the moment.</div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'exam-running' && selectedExam && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
              <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <div>
                  <h3 className="font-bold text-indigo-400">EXAM IN PROGRESS</h3>
                  <p className="text-xs text-slate-500">{selectedExam.title}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl font-mono font-bold">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
              </header>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                        {currentQuestionIdx + 1}
                      </span>
                      <p className="text-xl font-medium leading-relaxed">
                        {selectedExam.questions[currentQuestionIdx].text}
                      </p>
                    </div>

                    <RadioGroup
                      value={answers[selectedExam.questions[currentQuestionIdx].id]}
                      onValueChange={(val) => setAnswers({ ...answers, [selectedExam.questions[currentQuestionIdx].id]: val })}
                      className="grid gap-4"
                    >
                      {selectedExam.questions[currentQuestionIdx].options.map((opt, i) => {
                        const letter = String.fromCharCode(65 + i);
                        return (
                          <div key={letter} className="flex items-center space-x-2">
                            <RadioGroupItem value={letter} id={`q-${letter}`} className="sr-only" />
                            <Label
                              htmlFor={`q-${letter}`}
                              className={`flex-1 p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                                answers[selectedExam.questions[currentQuestionIdx].id] === letter
                                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-200'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold">
                                {letter}
                              </span>
                              {opt}
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <footer className="p-6 bg-slate-900 border-t border-slate-800">
                <div className="max-w-2xl mx-auto flex justify-between items-center">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                    className="px-6 py-3 bg-slate-800 disabled:opacity-30 rounded-xl font-bold flex items-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" /> PREVIOUS
                  </button>
                  {currentQuestionIdx < selectedExam.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2"
                    >
                      NEXT <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalSubmit}
                      className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-600/20"
                    >
                      SUBMIT <Send className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </footer>
            </motion.div>
          )}

          {view === 'results' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
               <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-400 mb-2">
                <ChevronLeft className="w-4 h-4" /> Back to Home
              </button>
              <h2 className="text-2xl font-bold">My Performance</h2>

              {showResults ? (
                <div className="space-y-4">
                  {userResults.length > 0 ? (
                    userResults.map((res, i) => {
                      const exam = exams.find(e => e.id === res.examId);
                      const average = ((res.score / res.total) * 100).toFixed(1);
                      return (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-xl">{exam?.title || 'Exam'}</h4>
                              <p className="text-slate-500 text-xs">{new Date(res.submittedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-black text-indigo-500">{average}%</span>
                              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Average Score</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <ResultStat icon={<CheckCircle2 className="text-green-500" />} label="Right" value={res.correct} color="bg-green-500/10" />
                            <ResultStat icon={<XCircle className="text-red-500" />} label="Missed" value={res.missed} color="bg-red-500/10" />
                            <ResultStat icon={<FileBarChart className="text-indigo-500" />} label="Mark" value={`${res.score}/${res.total}`} color="bg-indigo-500/10" />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-20 text-slate-600">No exams completed yet.</div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/50 p-12 rounded-3xl border border-dashed border-slate-800 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-amber-500 opacity-50" />
                  <p className="text-slate-400 font-medium">Results are pending.</p>
                  <p className="text-slate-600 text-sm mt-2">The owner hasn't posted the results yet. Please check back later.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const DashboardCard = ({ icon, label, count, onClick, color }: any) => (
  <button
    onClick={onClick}
    className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 hover:bg-slate-800 transition-all active:scale-95 group"
  >
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="text-center">
      <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">{label}</p>
      {count !== undefined && <p className="text-2xl font-black mt-1">{count}</p>}
    </div>
  </button>
);

const ResultStat = ({ icon, label, value, color }: any) => (
  <div className={`${color} p-4 rounded-2xl flex flex-col items-center gap-1`}>
    {icon}
    <p className="text-[10px] uppercase font-bold text-slate-400">{label}</p>
    <p className="text-lg font-black">{value}</p>
  </div>
);

export default UserDashboard;