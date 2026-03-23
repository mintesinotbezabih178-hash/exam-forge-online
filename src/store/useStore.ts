import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Exam {
  id: string;
  title: string;
  questions: Question[];
  durationMinutes: number;
  isPublished: boolean;
  createdAt: number;
}

export interface UserResult {
  examId: string;
  score: number;
  total: number;
  correct: number;
  missed: number;
  submittedAt: number;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  password: string;
  results: UserResult[];
}

interface State {
  owner: {
    id: string;
    phone: string;
  };
  users: User[];
  exams: Exam[];
  showResults: boolean;
  currentUser: User | null;
  isOwnerLoggedIn: boolean;

  setOwner: (owner: { id: string; phone: string }) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  addExam: (exam: Exam) => void;
  updateExam: (exam: Exam) => void;
  togglePublishResults: () => void;
  setCurrentUser: (user: User | null) => void;
  setOwnerLoggedIn: (status: boolean) => void;
  deleteExam: (id: string) => void;
  publishExam: (id: string) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      owner: {
        id: '0000',
        phone: '0900000000',
      },
      users: [],
      exams: [],
      showResults: false,
      currentUser: null,
      isOwnerLoggedIn: false,

      setOwner: (owner) => set({ owner }),
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (updatedUser) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
          currentUser: state.currentUser?.id === updatedUser.id ? updatedUser : state.currentUser,
        })),
      addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
      updateExam: (updatedExam) => set((state) => ({
        exams: state.exams.map((e) => (e.id === updatedExam.id ? updatedExam : e))
      })),
      togglePublishResults: () => set((state) => ({ showResults: !state.showResults })),
      setCurrentUser: (user) => set({ currentUser: user }),
      setOwnerLoggedIn: (status) => set({ isOwnerLoggedIn: status }),
      deleteExam: (id) => set((state) => ({ exams: state.exams.filter((e) => e.id !== id) })),
      publishExam: (id) => set((state) => ({
        exams: state.exams.map(e => e.id === id ? { ...e, isPublished: true } : e)
      })),
    }),
    {
      name: 'beka-online-storage',
    }
  )
);