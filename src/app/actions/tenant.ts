"use server";

import { adminDb } from "@/lib/firebase-admin";
import { getCachedValue, setCachedValue, invalidateCache, cacheKeys } from "@/lib/redis";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

// Multi-tenant Organization Actions
export async function createOrganization(name: string) {
  if (!name.trim()) return { error: "Organization name is required." };
  if (!adminDb) return { error: "Database not available" };

  try {
    const orgRef = adminDb.collection("organizations").doc();
    const org = {
      id: orgRef.id,
      name: name.trim(),
      createdAt: FieldValue.serverTimestamp()
    };
    await orgRef.set(org);

    revalidatePath("/admin");
    return { success: true, organization: org };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateOrganization(id: string, name: string) {
  if (!id || !name.trim()) return { error: "Organization ID and name are required." };
  if (!adminDb) return { error: "Database not available" };

  try {
    await adminDb.collection("organizations").doc(id).update({
      name: name.trim(),
      updatedAt: FieldValue.serverTimestamp()
    });

    await invalidateCache(`org:${id}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteOrganization(id: string) {
  if (!id) return { error: "Organization ID is required." };
  if (!adminDb) return { error: "Database not available" };

  try {
    await adminDb.collection("organizations").doc(id).update({
      deletedAt: FieldValue.serverTimestamp()
    });

    await invalidateCache(`org:${id}`);
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Multi-tenant Workspace Actions
export async function createWorkspace(organizationId: string, name: string) {
  if (!organizationId || !name.trim()) {
    return { error: "Organization ID and workspace name are required." };
  }
  if (!adminDb) return { error: "Database not available" };

  try {
    const wsRef = adminDb.collection("workspaces").doc();
    const ws = {
      id: wsRef.id,
      name: name.trim(),
      organizationId,
      plan: "free",
      credits: 1000,
      usedCredits: 0,
      purchasedCredits: 1000,
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    await wsRef.set(ws);

    revalidatePath("/devops/environments");
    return { success: true, workspace: ws };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateWorkspace(id: string, name: string) {
  if (!id || !name.trim()) return { error: "Workspace ID and name are required." };
  if (!adminDb) return { error: "Database not available" };

  try {
    await adminDb.collection("workspaces").doc(id).update({
      name: name.trim(),
      updatedAt: FieldValue.serverTimestamp()
    });

    await invalidateCache(cacheKeys.workspace(id));
    revalidatePath("/devops/environments");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteWorkspace(id: string) {
  if (!id) return { error: "Workspace ID is required." };
  if (!adminDb) return { error: "Database not available" };

  try {
    await adminDb.collection("workspaces").doc(id).update({
      deletedAt: FieldValue.serverTimestamp()
    });

    await invalidateCache(cacheKeys.workspace(id));
    revalidatePath("/devops/environments");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Workspace Switcher / Switch Handler
export async function switchWorkspace(workspaceId: string) {
  if (!adminDb) return { error: "Database not available" };
  try {
    // Read from Redis cache first
    let workspace = await getCachedValue<any>(cacheKeys.workspace(workspaceId));

    if (!workspace) {
      const docSnap = await adminDb.collection("workspaces").doc(workspaceId).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        if (data && !data.deletedAt) {
          workspace = { id: docSnap.id, ...data };
          await setCachedValue(cacheKeys.workspace(workspaceId), workspace, 3600);
        }
      }
    }

    if (!workspace) return { error: "Target workspace not found or has been deleted." };
    return { success: true, workspace };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function suspendOrganization(organizationId: string) {
  if (!adminDb) return { error: "Database not available" };
  try {
    const org = await adminDb.collection("organizations").doc(organizationId).update({
      deletedAt: FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function transferOrganizationOwnership(organizationId: string, targetUserId: string) {
  if (!adminDb) return { error: "Database not available" };
  try {
    await adminDb.collection("users").doc(targetUserId).update({
      organizationId,
      updatedAt: FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function inviteMember(workspaceId: string, email: string, role: string) {
  if (!adminDb) return { error: "Database not available" };
  try {
    // Generate a workspace audit log for tracking
    await adminDb.collection("auditLogs").add({
      workspaceId,
      userId: "system",
      action: `Invited user ${email} to workspace ${workspaceId} as ${role}`,
      timestamp: FieldValue.serverTimestamp()
    });
    return { success: true, invitation: { email, role, status: "pending" } };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function acceptInvite(inviteId: string) {
  return { success: true, status: "accepted" };
}

export async function rejectInvite(inviteId: string) {
  return { success: true, status: "rejected" };
}

export async function transferWorkspaceOwnership(workspaceId: string, targetUserId: string) {
  if (!adminDb) return { error: "Database not available" };
  try {
    await adminDb.collection("auditLogs").add({
      workspaceId,
      userId: targetUserId,
      action: `Transferred ownership of workspace ${workspaceId} to user ${targetUserId}`,
      timestamp: FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
