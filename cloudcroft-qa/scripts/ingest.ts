/**
 * Content Ingestion Script
 *
 * This script loads your Cloudcroft content into the vector database.
 * Run it with: npm run ingest
 *
 * Supports:
 * - Text files (.txt)
 * - Markdown files (.md)
 * - JSON files with content array
 * - PDF files (.pdf)
 * - Word documents (.docx)
 *
 * Place your content files in the /content directory
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import * as fs from "fs";
import * as path from "path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";
import { addDocument, getCollection } from "../lib/vectordb";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CHUNK_SIZE = 1000; // characters per chunk
const CHUNK_OVERLAP = 200; // overlap between chunks

interface ContentItem {
  id: string;
  content: string;
  metadata: {
    title?: string;
    source?: string;
    url?: string;
    [key: string]: string | undefined;
  };
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
    if (start + overlap >= text.length) break;
  }

  return chunks;
}

function loadTextFile(filePath: string): ContentItem[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath, path.extname(filePath));
  const chunks = chunkText(content, CHUNK_SIZE, CHUNK_OVERLAP);

  return chunks.map((chunk, i) => ({
    id: `${fileName}-chunk-${i}`,
    content: chunk,
    metadata: {
      title: fileName,
      source: filePath,
      chunk: String(i + 1),
      totalChunks: String(chunks.length),
    },
  }));
}

async function loadPdfFile(filePath: string): Promise<ContentItem[]> {
  const dataBuffer = fs.readFileSync(filePath);
  const uint8Array = new Uint8Array(dataBuffer);

  const pdfDoc = await getDocument({ data: uint8Array }).promise;
  const numPages = pdfDoc.numPages;

  let fullText = "";
  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }

  const fileName = path.basename(filePath, path.extname(filePath));
  const chunks = chunkText(fullText, CHUNK_SIZE, CHUNK_OVERLAP);

  return chunks.map((chunk, i) => ({
    id: `${fileName}-chunk-${i}`,
    content: chunk,
    metadata: {
      title: fileName,
      source: filePath,
      chunk: String(i + 1),
      totalChunks: String(chunks.length),
      pages: String(numPages),
    },
  }));
}

async function loadDocxFile(filePath: string): Promise<ContentItem[]> {
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value;

  const fileName = path.basename(filePath, path.extname(filePath));
  const chunks = chunkText(text, CHUNK_SIZE, CHUNK_OVERLAP);

  return chunks.map((chunk, i) => ({
    id: `${fileName}-chunk-${i}`,
    content: chunk,
    metadata: {
      title: fileName,
      source: filePath,
      chunk: String(i + 1),
      totalChunks: String(chunks.length),
    },
  }));
}

function loadJsonFile(filePath: string): ContentItem[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  // Support array of content items or single object with content array
  // Note: Check if data.items/data.content are arrays, not just truthy (Substack files have data.content as a string)
  const items = Array.isArray(data) ? data :
                (Array.isArray(data.items) ? data.items :
                (Array.isArray(data.content) ? data.content : [data]));

  const results: ContentItem[] = [];

  items.forEach((item: any, index: number) => {
    const content = item.content || item.text || item.body || "";
    const chunks = chunkText(content, CHUNK_SIZE, CHUNK_OVERLAP);

    chunks.forEach((chunk, chunkIndex) => {
      results.push({
        id: item.id || `json-${index}-chunk-${chunkIndex}`,
        content: chunk,
        metadata: {
          title: item.title || `Item ${index + 1}`,
          source: filePath,
          url: item.url,
          ...item.metadata,
        },
      });
    });
  });

  return results;
}

async function ingestContent() {
  console.log("🌲 Cloudcroft Knowledge Base Ingestion\n");

  // Ensure content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    console.log(`Created content directory: ${CONTENT_DIR}`);
    console.log("Add your .txt, .md, or .json files to this directory and run again.\n");

    // Create sample content file
    const sampleContent = `# Cloudcroft, New Mexico

Cloudcroft is a village in Otero County, New Mexico, United States. It sits at an elevation of 8,663 feet (2,640 m) in the Sacramento Mountains.

## History
Cloudcroft was established in 1899 as a railroad resort town. The Alamogordo and Sacramento Mountain Railway brought tourists to escape the desert heat.

## Attractions
- Lincoln National Forest
- The Lodge Resort (historic hotel)
- Sacramento Mountains
- Sunspot Solar Observatory
- Ski Cloudcroft

## Climate
Due to its high elevation, Cloudcroft enjoys cool summers and snowy winters, making it a popular escape from the hot lowlands of southern New Mexico.
`;

    fs.writeFileSync(path.join(CONTENT_DIR, "sample-cloudcroft.md"), sampleContent);
    console.log("Created sample content file. Edit or replace it with your own content.\n");
  }

  // Find all content files
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".txt", ".md", ".json", ".pdf", ".docx"].includes(ext);
  });

  if (files.length === 0) {
    console.log("No content files found in /content directory.");
    console.log("Add .txt, .md, .json, .pdf, or .docx files and run again.");
    return;
  }

  console.log(`Found ${files.length} content file(s)\n`);

  // Initialize collection
  await getCollection();

  let totalItems = 0;

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const ext = path.extname(file).toLowerCase();

    console.log(`Processing: ${file}`);

    let items: ContentItem[] = [];

    try {
      if (ext === ".json") {
        items = loadJsonFile(filePath);
      } else if (ext === ".pdf") {
        items = await loadPdfFile(filePath);
      } else if (ext === ".docx") {
        items = await loadDocxFile(filePath);
      } else {
        items = loadTextFile(filePath);
      }

      for (const item of items) {
        await addDocument(
          item.id,
          item.content,
          item.metadata as Record<string, string>
        );
        totalItems++;
      }

      console.log(`  ✓ Added ${items.length} chunks`);
    } catch (err) {
      console.error(`  ✗ Error: ${err}`);
    }
  }

  console.log(`\n✅ Ingestion complete! Added ${totalItems} items to the knowledge base.`);
}

// Run ingestion
ingestContent().catch(console.error);
