import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  TestSuite,
  TestCase,
  TestRunLog,
  VisualRegressionCheck,
  BugTicket,
  ReadinessChecklist
} from "@/types/qa";

interface QaState {
  suites: TestSuite[];
  testCases: TestCase[];
  runLogs: TestRunLog[];
  visualChecks: VisualRegressionCheck[];
  bugs: BugTicket[];
  readinessChecks: ReadinessChecklist[];

  runSuite: (suiteId: string) => void;
  approveVisualBaseline: (id: string) => void;
  rejectVisualBaseline: (id: string) => void;
  addBug: (title: string, severity: "critical" | "high" | "medium" | "low") => void;
  toggleReadiness: (id: string) => void;
}

const initialSuites: TestSuite[] = [
  { id: "suite-1", name: "WhatsApp Send Message API Logic", category: "integration", testCount: 24, passCount: 24, failCount: 0, status: "passed" },
  { id: "suite-2", name: "Super Admin RBAC Page Access", category: "e2e", testCount: 15, passCount: 15, failCount: 0, status: "passed" },
  { id: "suite-3", name: "SaaS Billing stripe checkout flows", category: "security", testCount: 8, passCount: 8, failCount: 0, status: "passed" }
];

const initialTestCases: TestCase[] = [
  { id: "tc-1", suiteId: "suite-1", title: "Should dispatch payload successfully when parameters are valid", status: "passed", durationMs: 42, owner: "Aditya" }
];

const initialRuns: TestRunLog[] = [
  { id: "run-1", runName: "Manual integration check dispatch", triggeredBy: "Aditya Tiwari", status: "passed", completedTime: new Date().toISOString(), durationMs: 1420 }
];

const initialVisual: VisualRegressionCheck[] = [
  { id: "vis-1", pagePath: "/developer/explorer", pixelDiffPercent: 0.12, status: "pending_approval", baselineUrl: "/baselines/explorer.png", currentUrl: "/screenshots/explorer.png" }
];

const initialBugs: BugTicket[] = [
  { id: "bug-1", title: "Double curly braces interpolation display layout in workflows [workflowId]", severity: "high", status: "resolved", assignedTo: "Aditya Tiwari", createdTime: new Date().toISOString() }
];

const initialReadiness: ReadinessChecklist[] = [
  { id: "read-1", label: "All unit and integration test suites pass", category: "testing", isCompleted: true },
  { id: "read-2", label: "Stitch theme tokens checked on mobile viewports", category: "testing", isCompleted: true },
  { id: "read-3", label: "Default API version configuration tests pass", category: "infrastructure", isCompleted: true }
];

export const useQa = create<QaState>()(
  persist(
    (set) => ({
      suites: initialSuites,
      testCases: initialTestCases,
      runLogs: initialRuns,
      visualChecks: initialVisual,
      bugs: initialBugs,
      readinessChecks: initialReadiness,

      runSuite: (suiteId) => {
        set((state) => ({
          suites: state.suites.map((s) => (s.id === suiteId ? { ...s, status: "running" as const } : s))
        }));

        setTimeout(() => {
          set((state) => ({
            suites: state.suites.map((s) => (s.id === suiteId ? { ...s, status: "passed" as const } : s)),
            runLogs: [
              {
                id: `run-${Date.now()}`,
                runName: `Auto suite run: ${suiteId}`,
                triggeredBy: "System CI Scheduler",
                status: "passed",
                completedTime: new Date().toISOString(),
                durationMs: 890
              },
              ...state.runLogs
            ]
          }));
        }, 1200);
      },

      approveVisualBaseline: (id) => {
        set((state) => ({
          visualChecks: state.visualChecks.map((v) => (v.id === id ? { ...v, status: "approved" as const } : v))
        }));
      },

      rejectVisualBaseline: (id) => {
        set((state) => ({
          visualChecks: state.visualChecks.map((v) => (v.id === id ? { ...v, status: "rejected" as const } : v))
        }));
      },

      addBug: (title, severity) => {
        set((state) => {
          const newBug: BugTicket = {
            id: `bug-${Date.now()}`,
            title,
            severity,
            status: "open",
            assignedTo: "Unassigned",
            createdTime: new Date().toISOString()
          };
          return {
            bugs: [newBug, ...state.bugs]
          };
        });
      },

      toggleReadiness: (id) => {
        set((state) => ({
          readinessChecks: state.readinessChecks.map((c) => (c.id === id ? { ...c, isCompleted: !c.isCompleted } : c))
        }));
      }
    }),
    {
      name: "expendmore-qa-store",
      partialize: (state) => ({
        suites: state.suites,
        visualChecks: state.visualChecks,
        bugs: state.bugs,
        readinessChecks: state.readinessChecks
      })
    }
  )
);
