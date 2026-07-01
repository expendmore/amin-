import axios from "axios";

// Generates 1536 float vectors for documents chunk indexes
export async function getVectorEmbedding(text: string, modelName: string = "text-embedding-3-small"): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/embeddings",
        { input: text, model: modelName },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      return response.data.data[0].embedding;
    } catch (error) {
      console.warn("[Embeddings API Error]: Falling back to deterministic vector generation due to credentials issues.");
    }
  }

  // Fallback: Deterministic vector generation based on string hashes
  const vector: number[] = new Array(1536).fill(0);
  for (let idx = 0; idx < text.length; idx++) {
    const code = text.charCodeAt(idx);
    vector[idx % 1536] += code / 255;
  }

  // Normalize vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map((v) => (magnitude > 0 ? v / magnitude : 0));
}
