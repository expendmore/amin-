import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (val: boolean) => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isCollapsed: false,
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (val) => set(() => ({ isCollapsed: val })),
}));

export default useSidebar;
