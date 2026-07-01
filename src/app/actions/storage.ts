"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

export async function createFolderAction(workspaceId: string, name: string) {
  if (!workspaceId || !name.trim()) {
    return { error: "Workspace ID and folder name are required." };
  }
  if (!adminDb) return { error: "Database not available" };

  try {
    const folderRef = adminDb.collection("folders").doc();
    const folder = {
      id: folderRef.id,
      workspaceId,
      name: name.trim(),
      createdAt: FieldValue.serverTimestamp()
    };
    await folderRef.set(folder);

    await adminDb.collection("auditLogs").add({
      workspaceId,
      userId: "system",
      action: `Created folder "${name}" in workspace ${workspaceId}`,
      timestamp: FieldValue.serverTimestamp()
    });

    revalidatePath("/files");
    return { success: true, folder };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function uploadFileAction(
  folderId: string,
  name: string,
  sizeBytes: number,
  url: string,
  workspaceId: string = "system_workspace"
) {
  if (!folderId || !name || !url) {
    return { error: "Folder ID, file name, and file URL are required." };
  }
  if (!adminDb) return { error: "Database not available" };

  try {
    const fileRef = adminDb.collection("files").doc();
    const file = {
      id: fileRef.id,
      folderId,
      workspaceId,
      name,
      sizeBytes,
      url,
      createdAt: FieldValue.serverTimestamp()
    };
    await fileRef.set(file);

    await adminDb.collection("auditLogs").add({
      workspaceId,
      userId: "system",
      action: `Uploaded file "${name}" into folder ${folderId} (Size: ${sizeBytes} bytes)`,
      timestamp: FieldValue.serverTimestamp()
    });

    revalidatePath("/files");
    return { success: true, file };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteFileAction(fileId: string, workspaceId: string = "system_workspace") {
  if (!fileId) return { error: "File ID is required." };
  if (!adminDb) return { error: "Database not available" };

  try {
    const fileDoc = await adminDb.collection("files").doc(fileId).get();
    if (!fileDoc.exists) return { error: "File not found." };
    const fileData = fileDoc.data();
    const fileName = fileData?.name || "Unknown file";
    const docWorkspaceId = fileData?.workspaceId || workspaceId;

    await adminDb.collection("files").doc(fileId).delete();

    await adminDb.collection("auditLogs").add({
      workspaceId: docWorkspaceId,
      userId: "system",
      action: `Deleted file "${fileName}" (ID: ${fileId})`,
      timestamp: FieldValue.serverTimestamp()
    });

    revalidatePath("/files");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
