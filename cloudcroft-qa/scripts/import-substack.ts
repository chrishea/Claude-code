/**
 * Substack Import Script
 *
 * Fetches all articles from a Substack publication sitemap and saves them
 * as JSON files for ingestion into the knowledge base.
 *
 * Usage:
 *   npm run import-substack
 *   npm run import-substack https://www.cloudcroftreader.com/sitemap/2025
 *   npm run import-substack https://www.cloudcroftreader.com/sitemap/2024
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const DEFAULT_SITEMAP_URL = "https://www.cloudcroftreader.com/sitemap/2025";

interface SubstackArticle {
  id: string;
  title: string;
  content: string;
  url: string;
  pubDate?: string;
  author?: string;
}

// Simple HTML to text converter
function htmlToText(html: string): string {
  return html
    // Remove script and style tags with content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    // Convert headers to text with newlines
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, "\n\n$1\n\n")
    // Convert common block elements to newlines
    .replace(/<\/?(p|div|br|li|tr)[^>]*>/gi, "\n")
    // Convert list items
    .replace(/<li[^>]*>/gi, "\n• ")
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, "")
    // Decode HTML entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "...")
    .replace(/&#\d+;/g, "")
    // Clean up whitespace
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/^\s+|\s+$/gm, "")
    .trim();
}

// Extract article URLs from sitemap page
async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  console.log(`📡 Fetching sitemap from: ${sitemapUrl}\n`);

  try {
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.status}`);
    }

    const html = await response.text();

    // Extract all /p/ article links
    const urlRegex = /href="(https:\/\/www\.cloudcroftreader\.com\/p\/[^"]+)"/g;
    const urls: string[] = [];
    let match;

    while ((match = urlRegex.exec(html)) !== null) {
      if (!urls.includes(match[1])) {
        urls.push(match[1]);
      }
    }

    // Also try without href quotes
    const urlRegex2 = /(https:\/\/www\.cloudcroftreader\.com\/p\/[\w-]+)/g;
    while ((match = urlRegex2.exec(html)) !== null) {
      if (!urls.includes(match[1])) {
        urls.push(match[1]);
      }
    }

    console.log(`📰 Found ${urls.length} article URLs\n`);
    return urls;
  } catch (error) {
    console.error(`Error fetching sitemap: ${error}`);
    return [];
  }
}

// Fetch a single article's content
async function fetchArticle(url: string): Promise<SubstackArticle | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<h1[^>]*class="[^"]*post-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i)
      || html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? htmlToText(titleMatch[1]).replace(/ - Cloudcroft Reader$/, "") : "";

    // Extract date
    const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"/i);
    const pubDate = dateMatch ? dateMatch[1] : "";

    // Extract author
    const authorMatch = html.match(/<a[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)<\/a>/i);
    const author = authorMatch ? htmlToText(authorMatch[1]) : "Cloudcroft Reader";

    // Extract main content - try multiple selectors
    let content = "";

    // Try post-content div
    const contentMatch = html.match(/<div[^>]*class="[^"]*available-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*subscription-widget/i);
    if (contentMatch) {
      content = htmlToText(contentMatch[1]);
    }

    // Try body markup
    if (!content || content.length < 100) {
      const bodyMatch = html.match(/<div[^>]*class="[^"]*body\s+markup[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<div[^>]*class="[^"]*post-footer|<\/article)/i);
      if (bodyMatch) {
        content = htmlToText(bodyMatch[1]);
      }
    }

    // Fallback: get all paragraph content
    if (!content || content.length < 100) {
      const paragraphs: string[] = [];
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let pMatch;
      while ((pMatch = pRegex.exec(html)) !== null) {
        const text = htmlToText(pMatch[1]);
        if (text.length > 20) {
          paragraphs.push(text);
        }
      }
      if (paragraphs.length > 3) {
        content = paragraphs.join("\n\n");
      }
    }

    if (!title || !content || content.length < 100) {
      return null;
    }

    // Create slug from URL
    const slug = url.split("/").pop() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    return {
      id: `substack-${slug}`,
      title,
      content,
      url,
      pubDate,
      author,
    };
  } catch (error) {
    return null;
  }
}

// Add delay between requests
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function importSubstack() {
  const sitemapUrl = process.argv[2] || DEFAULT_SITEMAP_URL;

  console.log("🌲 Cloudcroft Reader - Substack Import\n");
  console.log(`Sitemap: ${sitemapUrl}\n`);

  // Ensure content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  // Fetch article URLs from sitemap
  const urls = await fetchSitemapUrls(sitemapUrl);

  if (urls.length === 0) {
    console.log("No articles found. Check the URL and try again.");
    return;
  }

  console.log("📥 Downloading articles...\n");

  let savedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const slug = url.split("/").pop() || `article-${i}`;

    // Create a safe filename
    const safeSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);

    const filename = `substack-${safeSlug}.json`;
    const filepath = path.join(CONTENT_DIR, filename);

    // Check if already exists
    if (fs.existsSync(filepath)) {
      process.stdout.write(`⏩ [${i + 1}/${urls.length}] Already imported: ${slug.slice(0, 40)}...\n`);
      skippedCount++;
      continue;
    }

    // Fetch article
    process.stdout.write(`📄 [${i + 1}/${urls.length}] Fetching: ${slug.slice(0, 40)}...`);

    const article = await fetchArticle(url);

    if (!article) {
      console.log(" ❌ (failed or paywalled)");
      errorCount++;
      await delay(500);
      continue;
    }

    // Save as JSON
    const jsonContent = {
      id: article.id,
      title: article.title,
      content: article.content,
      url: article.url,
      pubDate: article.pubDate,
      author: article.author,
      metadata: {
        source: "Cloudcroft Reader (Substack)",
        importedAt: new Date().toISOString(),
      },
    };

    fs.writeFileSync(filepath, JSON.stringify(jsonContent, null, 2));
    console.log(` ✓ (${article.content.length} chars)`);
    savedCount++;

    // Be nice to the server
    await delay(300);
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   Saved: ${savedCount} new articles`);
  console.log(`   Skipped: ${skippedCount} (already imported)`);
  console.log(`   Errors: ${errorCount} (failed/paywalled)`);

  if (savedCount > 0) {
    console.log("\n📦 Next step: Run 'npm run ingest' to add articles to your knowledge base.");
  }
}

// Run import
importSubstack().catch(console.error);
