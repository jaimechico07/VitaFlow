// src/store/useAuthStore.js
import { create } from 'zustand';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    initAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            set({ user, loading: false });
        });
        return unsubscribe;
    },
}));
