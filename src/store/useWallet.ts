import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STARTING_BALANCE } from '../types/common';

interface WalletState {
  balance: number;
  totalWon: number;
  totalLost: number;
  placeBet: (amount: number) => boolean;
  winBet: (totalReturn: number, originalStake: number) => void;
  pushBet: (amount: number) => void;
  loseBet: (amount: number) => void;
  reset: () => void;
}

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: STARTING_BALANCE,
      totalWon: 0,
      totalLost: 0,

      placeBet: (amount: number) => {
        const { balance } = get();
        if (amount > balance) return false;
        set({ balance: balance - amount });
        return true;
      },

      winBet: (totalReturn: number, originalStake: number) => {
        set((state) => ({
          balance: state.balance + totalReturn,
          totalWon: state.totalWon + (totalReturn - originalStake),
        }));
      },

      pushBet: (amount: number) => {
        set((state) => ({
          balance: state.balance + amount,
        }));
      },

      loseBet: (amount: number) => {
        set((state) => ({
          totalLost: state.totalLost + amount,
        }));
      },

      reset: () => {
        set({
          balance: STARTING_BALANCE,
          totalWon: 0,
          totalLost: 0,
        });
      },
    }),
    {
      name: 'casino-classroom-wallet',
      partialize: (state) => ({
        balance: state.balance,
        totalWon: state.totalWon,
        totalLost: state.totalLost,
      }),
    }
  )
);
