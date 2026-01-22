/**
 * URL Scraper Script
 *
 * Scrapes content from a URL and saves it to the content directory
 * for later ingestion into the knowledge base.
 *
 * Usage: npx tsx scripts/scrape-url.ts <url> [output-filename]
 *
 * Example:
 *   npx tsx scripts/scrape-url.ts https://cloudcroft.net cloudcroft-info
 */

import * as fs from "fs";
import * as path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

async function scrapeUrl(url: string, outputName?: string) {
  console.log(`\n🌐 Scraping: ${url}\n`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    // Basic HTML to text conversion (you might want a proper library for production)
    let text = html
      // Remove scripts and styles
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      // Remove HTML tags
      .replace(/<[^>]+>/g, " ")
      // Decode HTML entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      // Clean up whitespace
      .replace(/\s+/g, " ")
      .trim();

    // Get title from original HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "Untitled";

    // Ensure content directory exists
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }

    // Generate filename
    const safeName = outputName || new URL(url).hostname.replace(/\./g, "-");
    const fileName = `${safeName}.json`;
    const filePath = path.join(CONTENT_DIR, fileName);

    // Save as JSON with metadata
    const content = {
      items: [
        {
          id: safeName,
          title: title,
          url: url,
          content: text,
          scrapedAt: new Date().toISOString(),
        },
      ],
    };

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));

    console.log(`✅ Saved to: ${filePath}`);
    console.log(`   Title: ${title}`);
    console.log(`   Content length: ${text.length} characters`);
    console.log(`\nRun 'npm run ingest' to add this to your knowledge base.`);
  } catch (err) {
    console.error(`❌ Error scraping URL:`, err);
  }
}

// Get URL from command line
const url = process.argv[2];
const outputName = process.argv[3];

if (!url) {
  console.log("Usage: npx tsx scripts/scrape-url.ts <url> [output-filename]");
  console.log("Example: npx tsx scripts/scrape-url.ts https://cloudcroft.net cloudcroft-main");
  process.exit(1);
}

scrapeUrl(url, outputName);
