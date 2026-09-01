import {create} from "zustand";
import { persist } from 'zustand/middleware'

type AuthStore = {
    user: string | null
    login: (name: string) => void
    logout: () => void
}

export const useAuthStore= create<AuthStore>()(persist(
    (set)=>({
        user: null,
        login: (name) => set({ user: name }),
        logout: () => set({ user: null }),
    }),{
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user }),
    }
))