import { create } from 'zustand';
import type { PasswordEntry } from '../types/passwords';

interface PasswordStore {
  passwords: PasswordEntry[];
  setPasswords: (passwords: PasswordEntry[]) => void;
}

export const usePasswordStore = create<PasswordStore>((set) => ({
  passwords: [],
  setPasswords: (passwords) => set({ passwords }),
}));