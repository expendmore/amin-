export interface TestSuite {
  id: string;
  name: string;
  category: "unit" | "integration" | "e2e" | "performance" | "accessibility" | "security";
  testCount: number;
  passCount: number;
  failCount: number;
  status: "passed" | "failed" | "running" | "idle";
}

export interface TestCase {
  id: string;
  suiteId: string;
  title: string;
  status: "passed" | "failed" | "skipped" | "queued";
  durationMs: number;
  owner: string;
}

export interface TestRunLog {
  id: string;
  runName: string;
  triggeredBy: string;
  status: "passed" | "failed" | "cancelled" | "running";
  completedTime: string;
  durationMs: number;
}

export interface VisualRegressionCheck {
  id: string;
  pagePath: string;
  pixelDiffPercent: number;
  status: "pending_approval" | "approved" | "rejected";
  baselineUrl: string;
  currentUrl: string;
}

export interface BugTicket {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  createdTime: string;
}

export interface ReadinessChecklist {
  id: string;
  label: string;
  category: "testing" | "security" | "performance" | "infrastructure";
  isCompleted: boolean;
}
