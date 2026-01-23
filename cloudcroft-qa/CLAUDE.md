# Claude Instructions for Cloudcroft QA

## Response Guidelines

When answering questions about Cloudcroft content:

1. **Never use the phrase "According to local sources,"** - Instead, either reference specific sources by name (e.g., "the Cloudcroft Reader reported") or present information directly without that attribution phrase.

2. **Avoid promotional language** - Do not use phrases like "world-class" when describing local amenities unless directly quoting a source.

## Content Management

- Content files are stored in `/content`
- Use `npm run import-substack <sitemap-url>` to import articles from Cloudcroft Reader
- Use `npm run ingest` to add content to the vector database
