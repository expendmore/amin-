"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { generateChunks } from "@/lib/chunker";
import { executeRAGRetrieval } from "@/lib/rag";
import { revalidatePath } from "next/cache";

export async function uploadDocumentAction(
  collectionId: string,
  title: string,
  content: string,
  workspaceId: string = "system_workspace"
) {
  if (!collectionId || !title || !content.trim()) {
    return { error: "Collection ID, document title, and content are required." };
  }
  if (!adminDb) return { error: "Database not available" };

  try {
    // Generate chunks list
    const chunks = generateChunks(content);

    // Save document to Firestore
    const docRef = adminDb.collection("documents").doc();
    const docId = docRef.id;
    const document = {
      id: docId,
      workspaceId,
      knowledgeBaseId: collectionId,
      title,
      content,
      createdAt: FieldValue.serverTimestamp()
    };
    await docRef.set(document);

    // Create Audit Log
    await adminDb.collection("auditLogs").add({
      workspaceId,
      userId: "system",
      action: `Uploaded RAG document: ${title} into collection ${collectionId}. Split into ${chunks.length} chunks.`,
      timestamp: FieldValue.serverTimestamp()
    });

    revalidatePath("/knowledge/library");
    return { success: true, document, chunksCount: chunks.length };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function searchKnowledgeAction(
  collectionId: string,
  query: string,
  topK: number = 3
) {
  if (!collectionId || !query) {
    return { error: "Collection ID and search query are required." };
  }

  try {
    const searchResult = await executeRAGRetrieval(collectionId, query, topK);
    return { success: true, ...searchResult };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function syncCollectionAction(collectionId: string, workspaceId: string = "system_workspace") {
  if (!adminDb) return { error: "Database not available" };
  try {
    await adminDb.collection("auditLogs").add({
      workspaceId,
      userId: "system",
      action: `Triggered scheduled synchronization scan for collection ${collectionId}`,
      timestamp: FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
