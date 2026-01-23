import { ChromaClient, Collection } from "chromadb";

const chroma = new ChromaClient();

let collection: Collection | null = null;

export async function getCollection(): Promise<Collection> {
  if (!collection) {
    // Using Chroma's default embedding function (all-MiniLM-L6-v2)
    // No API key required - runs locally
    collection = await chroma.getOrCreateCollection({
      name: "cloudcroft_knowledge",
      metadata: { description: "Cloudcroft NM knowledge base" },
    });
  }
  return collection;
}

export async function addDocument(
  id: string,
  content: string,
  metadata: Record<string, string> = {}
): Promise<void> {
  const coll = await getCollection();

  // Chroma will automatically generate embeddings using default model
  await coll.add({
    ids: [id],
    documents: [content],
    metadatas: [metadata],
  });
}

export async function searchDocuments(
  query: string,
  nResults: number = 5
): Promise<{ content: string; metadata: Record<string, string> }[]> {
  const coll = await getCollection();

  // Chroma will automatically embed the query
  const results = await coll.query({
    queryTexts: [query],
    nResults,
  });

  if (!results.documents?.[0]) {
    return [];
  }

  return results.documents[0].map((doc, i) => ({
    content: doc || "",
    metadata: (results.metadatas?.[0]?.[i] as Record<string, string>) || {},
  }));
}
