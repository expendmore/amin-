import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DevopsEnvironment,
  DeploymentRecord,
  PipelineRecord,
  FeatureFlagRollout,
  BackupSnapshot,
  DomainRecord,
  GlobalDevopsVariable
} from "@/types/devops";

interface DevopsState {
  environments: DevopsEnvironment[];
  deployments: DeploymentRecord[];
  pipelines: PipelineRecord[];
  flags: FeatureFlagRollout[];
  backups: BackupSnapshot[];
  domains: DomainRecord[];
  variables: GlobalDevopsVariable[];
  blueGreenTrafficSplit: number; // Split to Green (0 to 100)

  triggerDeployment: (version: string) => void;
  triggerRollback: (deploymentId: string) => void;
  setTrafficSplit: (greenPercent: number) => void;
  toggleFlag: (id: string) => void;
  addVariable: (key: string, value: string, isSecret: boolean) => void;
  deleteVariable: (id: string) => void;
  addBackup: () => void;
}

const initialEnvironments: DevopsEnvironment[] = [
  { id: "env-1", name: "ExpendMore Main Portal", type: "production", status: "active", url: "https://expendmore.ai", variablesCount: 14 },
  { id: "env-2", name: "Staging sandbox checks", type: "staging", status: "active", url: "https://staging.expendmore.ai", variablesCount: 14 }
];

const initialDeployments: DeploymentRecord[] = [
  { id: "dep-1", version: "1.2.0", commitHash: "7b8a1c9", status: "success", createdTime: new Date(Date.now() - 3600*1000).toISOString(), durationMs: 42000 }
];

const initialPipelines: PipelineRecord[] = [
  { id: "pipe-1", name: "Frontend pre-render checks build validation", status: "success", lastRun: new Date().toISOString(), durationMs: 27000 }
];

const initialFlags: FeatureFlagRollout[] = [
  { id: "flag-1", key: "new_whatsapp_inbox_v2", description: "Enables multi-operator real time chat layouts interfaces", percentage: 50, isEnabled: true }
];

const initialBackups: BackupSnapshot[] = [
  { id: "bak-1", fileName: "expendmore_prod_db_dump_2026_06_27.sql", fileSizeMb: 142.4, createdTime: new Date().toISOString(), type: "automatic" }
];

const initialDomains: DomainRecord[] = [
  { id: "dom-1", domainName: "expendmore.ai", dnsStatus: "verified", sslStatus: "active" }
];

const initialVariables: GlobalDevopsVariable[] = [
  { id: "var-1", key: "NEXT_PUBLIC_SUPABASE_URL", value: "https://dummy.supabase.co", isSecret: false }
];

export const useDevops = create<DevopsState>()(
  persist(
    (set) => ({
      environments: initialEnvironments,
      deployments: initialDeployments,
      pipelines: initialPipelines,
      flags: initialFlags,
      backups: initialBackups,
      domains: initialDomains,
      variables: initialVariables,
      blueGreenTrafficSplit: 10,

      triggerDeployment: (version) => {
        set((state) => {
          const newDep: DeploymentRecord = {
            id: `dep-${Date.now()}`,
            version,
            commitHash: `c_${Math.random().toString(16).substring(2, 8)}`,
            status: "building",
            createdTime: new Date().toISOString(),
            durationMs: 0
          };
          return {
            deployments: [newDep, ...state.deployments]
          };
        });

        setTimeout(() => {
          set((state) => ({
            deployments: state.deployments.map((d) => {
              if (d.version === version && d.status === "building") {
                return { ...d, status: "success" as const, durationMs: 38000 };
              }
              return d;
            })
          }));
        }, 1200);
      },

      triggerRollback: (deploymentId) => {
        set((state) => ({
          deployments: state.deployments.map((d) => (d.id === deploymentId ? { ...d, status: "rollback" as const } : d))
        }));
      },

      setTrafficSplit: (greenPercent) => {
        set(() => ({
          blueGreenTrafficSplit: greenPercent
        }));
      },

      toggleFlag: (id) => {
        set((state) => ({
          flags: state.flags.map((f) => (f.id === id ? { ...f, isEnabled: !f.isEnabled } : f))
        }));
      },

      addVariable: (key, value, isSecret) => {
        set((state) => {
          const newVar: GlobalDevopsVariable = {
            id: `var-${Date.now()}`,
            key,
            value: isSecret ? "••••••••" : value,
            isSecret
          };
          return {
            variables: [...state.variables, newVar]
          };
        });
      },

      deleteVariable: (id) => {
        set((state) => ({
          variables: state.variables.filter((v) => v.id !== id)
        }));
      },

      addBackup: () => {
        set((state) => {
          const newBak: BackupSnapshot = {
            id: `bak-${Date.now()}`,
            fileName: `expendmore_manual_backup_${Date.now()}.sql`,
            fileSizeMb: 148.2,
            createdTime: new Date().toISOString(),
            type: "manual"
          };
          return {
            backups: [newBak, ...state.backups]
          };
        });
      }
    }),
    {
      name: "expendmore-devops-store",
      partialize: (state) => ({
        environments: state.environments,
        deployments: state.deployments,
        flags: state.flags,
        backups: state.backups,
        domains: state.domains,
        variables: state.variables,
        blueGreenTrafficSplit: state.blueGreenTrafficSplit
      })
    }
  )
);
