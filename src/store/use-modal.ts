import { create } from "zustand";

export type ModalType = "upgrade" | "confirm-delete" | "share-doc" | "settings" | null;

interface ModalState {
  type: ModalType;
  isOpen: boolean;
  data: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const useModal = create<ModalState>((set) => ({
  type: null,
  isOpen: false,
  data: null,
  openModal: (type, data = null) =>
    set({
      type,
      isOpen: true,
      data,
    }),
  closeModal: () =>
    set({
      type: null,
      isOpen: false,
      data: null,
    }),
}));
