import { create } from 'zustand';
import { api } from '@/lib/api';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  ownerId: string;
  premium: boolean;
  modules: { moduleName: string; enabled: boolean }[];
}

interface GuildState {
  guilds: Guild[];
  selectedGuild: Guild | null;
  loading: boolean;
  fetchGuilds: () => Promise<void>;
  selectGuild: (guild: Guild | null) => void;
  toggleModule: (guildId: string, moduleName: string, enabled: boolean) => Promise<void>;
}

export const useGuilds = create<GuildState>((set) => ({
  guilds: [],
  selectedGuild: null,
  loading: false,

  fetchGuilds: async () => {
    try {
      set({ loading: true });
      const data = await api.get<{ data: Guild[] }>('/api/v1/guilds');
      set({ guilds: data.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  selectGuild: (guild) => set({ selectedGuild: guild }),

  toggleModule: async (guildId, moduleName, enabled) => {
    await api.post(`/api/v1/guilds/${guildId}/modules`, { moduleName, enabled });
    set((state) => ({
      selectedGuild: state.selectedGuild?.id === guildId
        ? {
            ...state.selectedGuild,
            modules: state.selectedGuild.modules.map((m) =>
              m.moduleName === moduleName ? { ...m, enabled } : m,
            ),
          }
        : state.selectedGuild,
    }));
  },
}));
