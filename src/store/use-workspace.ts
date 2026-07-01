import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceInfo {
  id: string;
  name: string;
  organizationId: string;
}

interface OrganizationInfo {
  id: string;
  name: string;
}

interface WorkspaceState {
  activeWorkspaceId: string | null;
  activeOrganizationId: string | null;
  workspaces: WorkspaceInfo[];
  organizations: OrganizationInfo[];

  setActiveWorkspaceId: (id: string) => void;
  setActiveOrganizationId: (id: string) => void;
  setWorkspaces: (list: WorkspaceInfo[]) => void;
  setOrganizations: (list: OrganizationInfo[]) => void;
}

export const useWorkspace = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      activeOrganizationId: null,
      workspaces: [],
      organizations: [],

      setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
      setActiveOrganizationId: (id) => set({ activeOrganizationId: id }),
      setWorkspaces: (list) => set({ workspaces: list }),
      setOrganizations: (list) => set({ organizations: list })
    }),
    {
      name: "expendmore-workspace-store"
    }
  )
);
