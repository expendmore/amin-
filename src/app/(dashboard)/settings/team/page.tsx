"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DashboardShell from "@/components/navigation/DashboardShell";
import PageContainer from "@/components/navigation/PageContainer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/store/use-toast";
import { 
  UserPlus, 
  Shield, 
  Trash2, 
  Check, 
  X, 
  Users, 
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Schema for invite form validation
const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["MEMBER", "AGENT", "MANAGER", "ADMIN"]),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "GUEST" | "VIEWER" | "MEMBER" | "AGENT" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";
  status: "Active" | "Deactivated";
}

interface PendingInvite {
  id: string;
  email: string;
  role: "MEMBER" | "AGENT" | "MANAGER" | "ADMIN";
  sent_at: string;
}

export default function TeamSpacePage() {
  const { addToast } = useToast();
  const [isMatrixExpanded, setIsMatrixExpanded] = useState(true);

  // Mock initial team members state
  const [members, setMembers] = useState<TeamMember[]>([
    { id: "m1", name: "Arjun Sharma", email: "arjun@aisensy.com", role: "SUPER_ADMIN", status: "Active" },
    { id: "m2", name: "Priya Patel", email: "priya@aisensy.com", role: "MANAGER", status: "Active" },
    { id: "m3", name: "Rohan Gupta", email: "rohan@aisensy.com", role: "AGENT", status: "Active" },
    { id: "m4", name: "Sarah Jenkins", email: "sarah@aisensy.com", role: "MEMBER", status: "Active" },
    { id: "m5", name: "Kabir Shah", email: "kabir@aisensy.com", role: "MEMBER", status: "Deactivated" },
  ]);

  // Mock initial pending invites state
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([
    { id: "p1", email: "amit.kumar@aisensy.com", role: "AGENT", sent_at: "2026-06-26" }
  ]);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  // Handle send invitation
  const onSubmit = async (data: InviteFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // Check if user is already a member
    const alreadyMember = members.some((m) => m.email.toLowerCase() === data.email.toLowerCase());
    const alreadyPending = pendingInvites.some((p) => p.email.toLowerCase() === data.email.toLowerCase());
    
    if (alreadyMember) {
      addToast("User is already a workspace member.", "error");
      return;
    }

    if (alreadyPending) {
      addToast("An invitation is already pending for this email.", "error");
      return;
    }

    const newInvite: PendingInvite = {
      id: `p_${Math.random().toString(36).substring(2, 9)}`,
      email: data.email,
      role: data.role,
      sent_at: new Date().toISOString().split("T")[0]
    };

    setPendingInvites(prev => [...prev, newInvite]);
    addToast(`Invitation sent successfully to ${data.email}!`, "success");
    reset();
  };

  // Toggle member active/deactivated state
  const handleToggleStatus = (id: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === "Active" ? "Deactivated" : "Active";
        addToast(`Member status updated to ${nextStatus}`, "info");
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  // Remove a member from the workspace
  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the workspace?`)) {
      setMembers(prev => prev.filter(m => m.id !== id));
      addToast(`Removed ${name} from the workspace.`, "info");
    }
  };

  // Cancel a pending invitation
  const handleCancelInvite = (id: string, email: string) => {
    setPendingInvites(prev => prev.filter(p => p.id !== id));
    addToast(`Cancelled invitation for ${email}`, "info");
  };

  // Permissions Data Structure
  const permissionsList = [
    { name: "Dashboard Overview", GUEST: false, VIEWER: true, MEMBER: true, AGENT: true, MANAGER: true, ADMIN: true, SUPER_ADMIN: true },
    { name: "AI Assistant / Chat", GUEST: false, VIEWER: true, MEMBER: true, AGENT: true, MANAGER: true, ADMIN: true, SUPER_ADMIN: true },
    { name: "AI Agent Config", GUEST: false, VIEWER: false, MEMBER: false, AGENT: true, MANAGER: true, ADMIN: true, SUPER_ADMIN: true },
    { name: "Workflow Builder", GUEST: false, VIEWER: false, MEMBER: false, AGENT: true, MANAGER: true, ADMIN: true, SUPER_ADMIN: true },
    { name: "WhatsApp Campaigns", GUEST: false, VIEWER: false, MEMBER: false, AGENT: true, MANAGER: true, ADMIN: true, SUPER_ADMIN: true },
    { name: "Analytics & Export", GUEST: false, VIEWER: true, MEMBER: true, AGENT: false, MANAGER: true, ADMIN: true, SUPER_ADMIN: true },
    { name: "API & Access Tokens", GUEST: false, VIEWER: false, MEMBER: false, GUEST_NO: false, MANAGER: true, ADMIN: true, SUPER_ADMIN: true },
    { name: "Billing & Subscriptions", GUEST: false, VIEWER: false, MEMBER: false, AGENT: false, MANAGER: false, ADMIN: true, SUPER_ADMIN: true },
    { name: "Team & Member Mgmt", GUEST: false, VIEWER: false, MEMBER: false, AGENT: false, MANAGER: false, ADMIN: true, SUPER_ADMIN: true },
  ];

  return (
    <DashboardShell>
      <PageContainer
        title="Team Space"
        subtitle="Invite team members, assign workspace roles, and manage system access permissions."
      >
        <div className="flex flex-col gap-6 max-w-6xl pb-10">
          
          {/* Top Panel: Metrics & Invite Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Metric / Details Card */}
            <div className="lg:col-span-1 border border-border bg-card rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-brand-sky select-none">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-bold text-foreground">Workspace Workspace Space</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  Assign granular system roles. Workspace members gain access to shared models, workflow catalogs, and integration hooks based on their designated rank.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 mt-4 select-none">
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-foreground font-mono">
                    {members.filter(m => m.status === "Active").length}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Active Members</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-foreground font-mono">
                    {pendingInvites.length}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Pending Invites</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-brand-sky font-mono">50</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Seat Limit</span>
                </div>
              </div>
            </div>

            {/* Invite Form Card */}
            <div className="lg:col-span-2 border border-border bg-card rounded-2xl p-6">
              <div className="flex flex-col gap-1 mb-4 select-none">
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <UserPlus className="h-4.5 w-4.5 text-brand-sky" />
                  Invite Workspace Members
                </span>
                <p className="text-xs text-muted-foreground">Send an invite link. Users must authenticate with the invited email.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  
                  {/* Email Input */}
                  <div className="flex-grow w-full">
                    <Input
                      label="Invitee Email"
                      placeholder="e.g. dev@company.com"
                      error={errors.email?.message}
                      {...register("email")}
                      className="bg-white dark:bg-zinc-900"
                    />
                  </div>

                  {/* Role Selection dropdown */}
                  <div className="flex flex-col gap-1.5 w-full md:w-56 shrink-0">
                    <label className="text-xs font-semibold text-brand-navy select-none">
                      Assigned Role
                    </label>
                    <select
                      {...register("role")}
                      className="h-10 px-3 bg-white dark:bg-zinc-900 border border-brand-border dark:border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15 dark:focus:border-primary dark:focus:ring-primary/15"
                    >
                      <option value="MEMBER">Member (Read/Write Canvas)</option>
                      <option value="AGENT">Agent (Execute AI Actions)</option>
                      <option value="MANAGER">Manager (Build Workflows)</option>
                      <option value="ADMIN">Admin (Full Control)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <Button 
                    type="submit" 
                    isLoading={isSubmitting}
                    className="w-full md:w-auto px-6 h-10 text-xs"
                  >
                    Send Workspace Invite
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Middle Panel: Workspace Members Table */}
          <div className="border border-border bg-card rounded-2xl p-6">
            <div className="flex flex-col gap-1 mb-4 select-none">
              <span className="text-sm font-bold text-foreground">Workspace Members & Invites</span>
              <p className="text-xs text-muted-foreground">Manage active seats and deactivation statuses.</p>
            </div>

            <div className="flex flex-col gap-6">
              
              {/* Active Members Grid */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase select-none">Active Members</span>
                <div className="border border-border rounded-xl overflow-hidden bg-zinc-900/30">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-zinc-900/60 text-muted-foreground select-none">
                        <th className="p-3.5 font-semibold">User</th>
                        <th className="p-3.5 font-semibold">Role Priority</th>
                        <th className="p-3.5 font-semibold">Status</th>
                        <th className="p-3.5 font-semibold text-center">Active Switch</th>
                        <th className="p-3.5 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id} className="border-b border-border last:border-0 hover:bg-zinc-900/10">
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-zinc-800 text-[10px] font-bold font-mono text-zinc-300 flex items-center justify-center select-none uppercase">
                                {m.name.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">{m.name}</span>
                                <span className="text-[10px] text-muted-foreground">{m.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                              m.role.includes("ADMIN")
                                ? "bg-red-950/20 border-red-500/20 text-red-400"
                                : m.role === "MANAGER"
                                ? "bg-amber-950/20 border-amber-500/20 text-amber-400"
                                : m.role === "AGENT"
                                ? "bg-brand-sky-light/10 border-brand-sky/20 text-brand-sky"
                                : "bg-zinc-800 border-zinc-700 text-zinc-300"
                            }`}>
                              {m.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                              m.status === "Active" ? "text-emerald-400" : "text-muted-foreground"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                m.status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground"
                              }`} />
                              {m.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            {m.role === "SUPER_ADMIN" ? (
                              <span className="text-[10px] text-muted-foreground italic select-none">Protected</span>
                            ) : (
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={m.status === "Active"}
                                  onChange={() => handleToggleStatus(m.id)}
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-sky" />
                              </label>
                            )}
                          </td>
                          <td className="p-3.5 text-center">
                            {m.role === "SUPER_ADMIN" ? (
                              <span className="text-[10px] text-muted-foreground italic select-none">System Root</span>
                            ) : (
                              <button
                                onClick={() => handleRemoveMember(m.id, m.name)}
                                className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-all inline-flex items-center justify-center cursor-pointer"
                                title="Remove User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Invites Grid */}
              {pendingInvites.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase select-none">Pending Invites</span>
                  <div className="border border-border rounded-xl overflow-hidden bg-zinc-900/30">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-zinc-900/60 text-muted-foreground select-none">
                          <th className="p-3.5 font-semibold">Invited Email</th>
                          <th className="p-3.5 font-semibold">Target Role</th>
                          <th className="p-3.5 font-semibold">Sent Date</th>
                          <th className="p-3.5 font-semibold text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingInvites.map((p) => (
                          <tr key={p.id} className="border-b border-border last:border-0 hover:bg-zinc-900/10">
                            <td className="p-3.5 font-medium text-foreground">{p.email}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">
                                {p.role}
                              </span>
                            </td>
                            <td className="p-3.5 text-muted-foreground">{p.sent_at}</td>
                            <td className="p-3.5 text-center">
                              <button
                                onClick={() => handleCancelInvite(p.id, p.email)}
                                className="px-2.5 py-1 text-[10px] font-bold text-destructive hover:bg-destructive/10 rounded transition-all cursor-pointer"
                              >
                                Revoke Invite
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Panel: Role Permissions Matrix */}
          <div className="border border-border bg-card rounded-2xl p-6">
            <button
              onClick={() => setIsMatrixExpanded(!isMatrixExpanded)}
              className="w-full flex items-center justify-between font-bold text-foreground text-left select-none cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-brand-sky" />
                <span className="text-sm">Role Privilege Mapping Matrix</span>
              </div>
              {isMatrixExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {isMatrixExpanded && (
              <div className="mt-4 flex flex-col gap-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Interactive matrix representation of what views each role tier is authorized to open and manage.
                </p>

                <div className="border border-border rounded-xl overflow-x-auto bg-zinc-900/30">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border bg-zinc-900/60 text-muted-foreground select-none">
                        <th className="p-3 font-semibold min-w-[180px]">Feature Area / View</th>
                        <th className="p-3 font-semibold text-center">Guest</th>
                        <th className="p-3 font-semibold text-center">Viewer</th>
                        <th className="p-3 font-semibold text-center">Member</th>
                        <th className="p-3 font-semibold text-center">Agent</th>
                        <th className="p-3 font-semibold text-center">Manager</th>
                        <th className="p-3 font-semibold text-center">Admin</th>
                        <th className="p-3 font-semibold text-center">Super Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissionsList.map((p, idx) => (
                        <tr key={idx} className="border-b border-border last:border-0 hover:bg-zinc-900/10">
                          <td className="p-3 font-medium text-foreground">{p.name}</td>
                          
                          {/* Guest */}
                          <td className="p-3 text-center">
                            {p.GUEST ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-3.5 w-3.5 text-zinc-600 mx-auto" />}
                          </td>
                          
                          {/* Viewer */}
                          <td className="p-3 text-center">
                            {p.VIEWER ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-3.5 w-3.5 text-zinc-600 mx-auto" />}
                          </td>

                          {/* Member */}
                          <td className="p-3 text-center">
                            {p.MEMBER ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-3.5 w-3.5 text-zinc-600 mx-auto" />}
                          </td>

                          {/* Agent */}
                          <td className="p-3 text-center">
                            {p.AGENT ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-3.5 w-3.5 text-zinc-600 mx-auto" />}
                          </td>

                          {/* Manager */}
                          <td className="p-3 text-center">
                            {p.MANAGER ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-3.5 w-3.5 text-zinc-600 mx-auto" />}
                          </td>

                          {/* Admin */}
                          <td className="p-3 text-center">
                            {p.ADMIN ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-3.5 w-3.5 text-zinc-600 mx-auto" />}
                          </td>

                          {/* Super Admin */}
                          <td className="p-3 text-center">
                            {p.SUPER_ADMIN ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-3.5 w-3.5 text-zinc-600 mx-auto" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-3.5 bg-brand-sky-light/5 border border-brand-sky/20 rounded-xl flex gap-2.5 mt-1 select-none">
                  <Info className="h-4.5 w-4.5 text-brand-sky shrink-0 mt-0.5" />
                  <span className="text-[11px] text-zinc-300 leading-normal">
                    Note: Roles are cumulative. Ranks inherit permissions of all lower-tier profiles (e.g. AGENT inherits all MEMBER functions). Security middleware resolves paths based on priority index values.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
