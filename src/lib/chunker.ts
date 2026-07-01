export interface TextChunk {
  content: string;
  tokenCount: number;
}

// Simple sliding window chunker for documents processing
export function generateChunks(text: string, chunkSize: number = 300, chunkOverlap: number = 50): TextChunk[] {
  if (!text) return [];

  const words = text.split(/\s+/);
  const chunks: TextChunk[] = [];

  let i = 0;
  while (i < words.length) {
    const chunkWords = words.slice(i, i + chunkSize);
    const content = chunkWords.join(" ");

    // Approximately 1 word = 1.3 tokens
    const tokenCount = Math.round(chunkWords.length * 1.3);

    chunks.push({ content, tokenCount });

    i += chunkSize - chunkOverlap;
  }

  return chunks;
}
