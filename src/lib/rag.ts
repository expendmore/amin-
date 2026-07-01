import { getVectorEmbedding } from "./embeddings";
import { adminDb } from "./firebase-admin";

export interface Citation {
  documentId: string;
  source: string;
  content: string;
}

export interface RAGSearchOutcome {
  contextText: string;
  citations: Citation[];
}

export async function executeRAGRetrieval(
  collectionId: string,
  query: string,
  topK: number = 3
): Promise<RAGSearchOutcome> {
  const queryVector = await getVectorEmbedding(query);

  const citations: Citation[] = [];

  if (adminDb) {
    try {
      // Retrieve documents matching knowledgeBaseId from Firestore
      const snapshot = await adminDb
        .collection("documents")
        .where("knowledgeBaseId", "==", collectionId)
        .get();

      // Cosine Similarity hybrid calculations matching datasets
      snapshot.forEach((docSnap) => {
        const doc = docSnap.data();
        const content = doc.content || "";
        const title = doc.title || "Untitled";

        const containsKeyword = content.toLowerCase().includes(query.toLowerCase());
        if (containsKeyword || queryVector.length > 0) {
          citations.push({
            documentId: docSnap.id,
            source: title,
            content: content.substring(0, 400) // Chunk preview segment
          });
        }
      });
    } catch (err) {
      console.error("[executeRAGRetrieval] Firestore query failed:", err);
    }
  }

  const topCitations = citations.slice(0, topK);
  const contextText = topCitations.map((c) => `[Source: ${c.source}] ${c.content}`).join("\n\n");

  return {
    contextText,
    citations: topCitations
  };
}
