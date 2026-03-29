import { create } from 'zustand';

type ModalType = 'search' | 'terms' | 'privacy' | 'delivery' | 'returns' | 'legal' | null;

interface ModalStore {
  type: ModalType;
  isOpen: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  openModal: (type) => set({ type, isOpen: true }),
  closeModal: () => set({ isOpen: false, type: null }),
}));
