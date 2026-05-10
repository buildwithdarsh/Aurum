import { create } from 'zustand';
import type {
  BankAccount,
  BankCard,
  Beneficiary,
} from '@buildwithdarsh/sdk';

interface BankingState {
  accounts: BankAccount[];
  cards: BankCard[];
  beneficiaries: Beneficiary[];
  activeAccountId: string | null;
  setAccounts: (accounts: BankAccount[]) => void;
  setCards: (cards: BankCard[]) => void;
  setBeneficiaries: (beneficiaries: Beneficiary[]) => void;
  setActiveAccountId: (id: string | null) => void;
}

export const useBankingStore = create<BankingState>((set) => ({
  accounts: [],
  cards: [],
  beneficiaries: [],
  activeAccountId: null,
  setAccounts: (accounts) => set({ accounts }),
  setCards: (cards) => set({ cards }),
  setBeneficiaries: (beneficiaries) => set({ beneficiaries }),
  setActiveAccountId: (id) => set({ activeAccountId: id }),
}));
