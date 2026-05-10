import { create } from 'zustand';
import type { EndUser, KycStatusResponse } from '@buildwithdarsh/sdk';

interface AuthState {
  user: EndUser | null;
  isAuthenticated: boolean;
  kycStatus: KycStatusResponse | null;
  setUser: (user: EndUser | null) => void;
  setKycStatus: (status: KycStatusResponse | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  kycStatus: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setKycStatus: (kycStatus) => set({ kycStatus }),
  logout: () => set({ user: null, isAuthenticated: false, kycStatus: null }),
}));
