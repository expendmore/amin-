import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  OrgRecord,
  WorkspaceRecord,
  UserRecord,
  RoleRecord,
  FeatureFlag,
  QueueJob,
  SystemMetrics,
  ExceptionLog,
  Announcement,
  BackupSchedule,
  TicketItem,
  AdminAuditLog
} from "@/types/admin";

interface AdminState {
  orgs: OrgRecord[];
  workspaces: WorkspaceRecord[];
  users: UserRecord[];
  roles: RoleRecord[];
  flags: FeatureFlag[];
  jobs: QueueJob[];
  metrics: SystemMetrics;
  errors: ExceptionLog[];
  announcements: Announcement[];
  backups: BackupSchedule[];
  tickets: TicketItem[];
  auditLogs: AdminAuditLog[];
  maintenanceMode: boolean;

  toggleOrgStatus: (id: string) => void;
  deleteOrg: (id: string) => void;
  updateWorkspaceLimits: (id: string, limits: { workflows: number; storage: number }) => void;
  revokeUserSession: (id: string) => void;
  toggleRolePermission: (roleName: string, permissionKey: string) => void;
  toggleFeatureFlag: (key: string) => void;
  updateFlagRollout: (key: string, percent: number) => void;
  triggerBackup: () => void;
  resolveError: (id: string) => void;
  submitAnnouncement: (title: string, type: "maintenance" | "announcement" | "update", text: string) => void;
  toggleMaintenanceMode: () => void;
  addAuditLog: (action: string, description: string) => void;
}

const initialOrgs: OrgRecord[] = [
  { id: "org-1", name: "Anshuman Enterprises", ownerName: "Aditya Tiwari", ownerEmail: "aditya@anshuman.com", status: "active", billingStatus: "paid", workspacesCount: 1, createdTime: new Date(Date.now() - 3600*1000*24*90).toISOString() },
  { id: "org-2", name: "Acme Corp Ltd", ownerName: "John Doe", ownerEmail: "john@acme.com", status: "active", billingStatus: "paid", workspacesCount: 2, createdTime: new Date(Date.now() - 3600*1000*24*45).toISOString() }
];

const initialWorkspaces: WorkspaceRecord[] = [
  { id: "ws-1", orgId: "org-1", name: "Main Production Space", limitsWorkflows: 20, limitsStorageGB: 10, limitsUsers: 10, status: "active", createdTime: new Date().toISOString() }
];

const initialUsers: UserRecord[] = [
  { id: "usr-1", name: "Aditya Tiwari", email: "aditya@anshuman.com", role: "Super Admin", status: "verified", activeSessionsCount: 2, deviceTypes: ["Macbook Pro", "iPhone 15"] }
];

const initialRoles: RoleRecord[] = [
  { name: "Super Admin", description: "Full platform permissions access", permissions: { "all_access": true, "billing_write": true, "users_write": true } },
  { name: "Support Specialist", description: "Access live chat and assist users tickets", permissions: { "all_access": false, "tickets_read": true, "tickets_write": true } }
];

const initialFlags: FeatureFlag[] = [
  { key: "beta_rag_sandbox", name: "RAG Sandbox Chat", description: "Expose Playground vectors retrieval checks UI", isEnabled: true, rolloutPercent: 50 }
];

const initialJobs: QueueJob[] = [
  { id: "job-1", name: "Vector Embeddings Batch Index", workerType: "RAG Worker", status: "queued", attempts: 0, timestamp: new Date().toISOString() }
];

const initialMetrics: SystemMetrics = {
  cpuUsagePercent: 32,
  memoryUsagePercent: 48,
  dbHealth: "optimal",
  storageHealth: "optimal"
};

const initialErrors: ExceptionLog[] = [
  { id: "err-1", name: "Supabase connection pool timeout", stacktrace: "Error: connect ETIMEDOUT 104.244.42.1 at TCPConnectWrap...", affectedUserEmail: "test@user.com", status: "unresolved", timestamp: new Date().toISOString() }
];

const initialAudit: AdminAuditLog[] = [
  { id: "aud-1", operator: "Super Admin (Aditya)", action: "maintenance_toggle", description: "Toggled platform maintenance mode configurations logs", timestamp: new Date().toISOString() }
];

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      orgs: initialOrgs,
      workspaces: initialWorkspaces,
      users: initialUsers,
      roles: initialRoles,
      flags: initialFlags,
      jobs: initialJobs,
      metrics: initialMetrics,
      errors: initialErrors,
      announcements: [],
      backups: [],
      tickets: [],
      auditLogs: initialAudit,
      maintenanceMode: false,

      toggleOrgStatus: (id) => {
        set((state) => ({
          orgs: state.orgs.map((o) => (o.id === id ? { ...o, status: o.status === "active" ? "suspended" : "active" } : o))
        }));
      },

      deleteOrg: (id) => {
        set((state) => ({
          orgs: state.orgs.filter((o) => o.id !== id)
        }));
      },

      updateWorkspaceLimits: (id, limits) => {
        set((state) => ({
          workspaces: state.workspaces.map((w) => (w.id === id ? { ...w, limitsWorkflows: limits.workflows, limitsStorageGB: limits.storage } : w))
        }));
      },

      revokeUserSession: (id) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, activeSessionsCount: 0 } : u))
        }));
      },

      toggleRolePermission: (roleName, permissionKey) => {
        set((state) => ({
          roles: state.roles.map((r) => {
            if (r.name === roleName) {
              const updated = { ...r.permissions };
              updated[permissionKey] = !updated[permissionKey];
              return { ...r, permissions: updated };
            }
            return r;
          })
        }));
      },

      toggleFeatureFlag: (key) => {
        set((state) => ({
          flags: state.flags.map((f) => (f.key === key ? { ...f, isEnabled: !f.isEnabled } : f))
        }));
      },

      updateFlagRollout: (key, percent) => {
        set((state) => ({
          flags: state.flags.map((f) => (f.key === key ? { ...f, rolloutPercent: percent } : f))
        }));
      },

      triggerBackup: () => {
        set((state) => {
          const newBackup: BackupSchedule = {
            id: `bak-${Date.now()}`,
            databaseSize: "2.4 GB",
            retentionDays: 30,
            lastBackupTime: new Date().toISOString(),
            cronPattern: "0 0 * * *"
          };
          return {
            backups: [newBackup, ...state.backups]
          };
        });
      },

      resolveError: (id) => {
        set((state) => ({
          errors: state.errors.map((e) => (e.id === id ? { ...e, status: "resolved" } : e))
        }));
      },

      submitAnnouncement: (title, type, text) => {
        set((state) => {
          const newAnn: Announcement = {
            id: `ann-${Date.now()}`,
            title,
            type,
            text,
            author: "Super Admin (Aditya)",
            date: new Date().toISOString()
          };
          return {
            announcements: [newAnn, ...state.announcements]
          };
        });
      },

      toggleMaintenanceMode: () => {
        set((state) => ({
          maintenanceMode: !state.maintenanceMode
        }));
      },

      addAuditLog: (action, description) => {
        set((state) => ({
          auditLogs: [
            {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action,
              operator: "Super Admin (Aditya)",
              description
            },
            ...state.auditLogs
          ]
        }));
      }
    }),
    {
      name: "expendmore-admin-store",
      partialize: (state) => ({
        orgs: state.orgs,
        workspaces: state.workspaces,
        flags: state.flags,
        maintenanceMode: state.maintenanceMode,
        backups: state.backups,
        announcements: state.announcements,
        errors: state.errors,
        auditLogs: state.auditLogs
      })
    }
  )
);
