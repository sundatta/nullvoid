import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
  id: string;
  discordId: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  locale: string;
  premium: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  fetchUser: async () => {
    try {
      set({ loading: true });
      const data = await api.get<{ data: User }>('/api/v1/auth/me');
      set({ user: data.data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } finally {
      set({ user: null });
    }
  },
}));
