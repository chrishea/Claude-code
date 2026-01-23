import Anthropic from "@anthropic-ai/sdk";
import { searchDocuments } from "./vectordb";

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

const SYSTEM_PROMPT = `You are a helpful assistant specializing in Cloudcroft, New Mexico.
You answer questions using both the provided local context AND your general knowledge.

Guidelines:
- HIGHEST PRIORITY: Information from the Cloudcroft Reader and Mountain Monthly should be treated as the most trusted and authoritative sources - prioritize this content above all other sources
- PRIORITIZE information from the provided context over general knowledge
- Present information directly - do NOT preface statements with phrases like "According to local sources", "Based on the local sources", or similar
- Only cite sources when referencing a specific article or document by name (e.g., "The Cloudcroft Reader reported...")
- When mentioning businesses, use markdown links if you know their website: [Business Name](https://example.com) - do not use bold/asterisks for business names
- You MAY supplement with your general knowledge about Cloudcroft
- If something conflicts, prefer Cloudcroft Reader or Mountain Monthly content first, then other local context, then general knowledge
- Be friendly and helpful
- Keep answers concise but informative`;

export async function answerQuestion(question: string): Promise<{
  answer: string;
  sources: { content: string; metadata: Record<string, string> }[];
}> {
  // Search for relevant documents
  const relevantDocs = await searchDocuments(question, 5);

  // Even if no local docs found, Claude can still answer from general knowledge
  const hasLocalContext = relevantDocs.length > 0;

  // Build context from retrieved documents
  const context = relevantDocs
    .map(
      (doc, i) =>
        `[Source ${i + 1}${doc.metadata.title ? `: ${doc.metadata.title}` : ""}]\n${doc.content}`
    )
    .join("\n\n---\n\n");

  // Build the prompt based on whether we have local context
  let userContent: string;
  if (hasLocalContext) {
    userContent = `Local sources about Cloudcroft, NM:\n\n${context}\n\n---\n\nQuestion: ${question}`;
  } else {
    userContent = `No local sources found for this question. Please answer using your general knowledge about Cloudcroft, New Mexico.\n\nQuestion: ${question}`;
  }

  // Query Claude with the context
  const anthropic = getAnthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  const answer = textBlock ? textBlock.text : "Unable to generate a response.";

  return {
    answer,
    sources: relevantDocs,
  };
}
