# Ask Cloudcroft - AI-Powered Q&A

A RAG (Retrieval-Augmented Generation) web application that answers questions about Cloudcroft, New Mexico using your custom content.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js UI    │────▶│   API Route     │────▶│  Claude API     │
│   (React)       │     │   /api/ask      │     │  (Answers)      │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   ChromaDB      │
                        │ (Vector Search) │
                        └─────────────────┘
```

## Quick Start

### 1. Install Dependencies

```bash
cd cloudcroft-qa
npm install
```

### 2. Set Up API Keys

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

- **Anthropic API Key**: Get from [console.anthropic.com](https://console.anthropic.com/)
- **OpenAI API Key**: Get from [platform.openai.com](https://platform.openai.com/) (used for embeddings only)

### 3. Start ChromaDB

ChromaDB runs as a separate service. Install and run it:

```bash
# Option A: Using pip
pip install chromadb
chroma run --path ./chroma-data

# Option B: Using Docker
docker run -p 8000:8000 chromadb/chroma
```

### 4. Add Your Content

Place your content files in the `/content` directory:

- **Text files** (`.txt`): Plain text about Cloudcroft
- **Markdown files** (`.md`): Formatted content
- **JSON files** (`.json`): Structured content (see format below)

#### JSON Format

```json
{
  "items": [
    {
      "id": "unique-id",
      "title": "Document Title",
      "content": "The actual content text...",
      "url": "https://source-url.com (optional)"
    }
  ]
}
```

#### Scrape from URLs

```bash
npx tsx scripts/scrape-url.ts https://example.com/cloudcroft-page my-page-name
```

### 5. Ingest Content

```bash
npm run ingest
```

This processes your content and stores it in the vector database.

### 6. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Cost Estimates (Free/Minimal Budget)

| Service | Free Tier | Pay-as-you-go |
|---------|-----------|---------------|
| **Vercel Hosting** | 100GB bandwidth/mo | $20/mo Pro |
| **Claude API** | - | ~$0.003/question |
| **OpenAI Embeddings** | - | ~$0.0001/1K tokens |
| **ChromaDB** | Self-hosted free | Cloud plans available |

**Estimated cost for 1000 questions/month**: ~$3-5

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

Note: You'll need a hosted vector database for production. Options:
- [Chroma Cloud](https://www.trychroma.com/) (coming soon)
- [Pinecone](https://www.pinecone.io/) (free tier available)
- [Supabase pgvector](https://supabase.com/vector) (free tier)

### Using Supabase (Free Alternative)

For a fully free solution, you can replace ChromaDB with Supabase's pgvector:

1. Create a free Supabase project
2. Enable the `vector` extension
3. Update `lib/vectordb.ts` to use Supabase client

## Adding More Content

### Manual Content

Create files in `/content`:

```markdown
<!-- content/restaurants.md -->
# Restaurants in Cloudcroft

## The Lodge Pavilion
Fine dining at the historic Lodge resort...

## Dusty Boots Cafe
Local favorite for breakfast...
```

### From Websites

```bash
# Scrape a single page
npx tsx scripts/scrape-url.ts https://cloudcroft.net

# Then ingest
npm run ingest
```

### From PDFs

For PDF support, add `pdf-parse` package:

```bash
npm install pdf-parse
```

Then modify `scripts/ingest.ts` to handle PDFs.

## Customization

### Change the Topic

This app works for any topic, not just Cloudcroft:

1. Update the system prompt in `lib/ai.ts`
2. Update the UI text in `app/page.tsx`
3. Update example questions
4. Add your own content

### Adjust Retrieval

In `lib/ai.ts`, modify:
- `nResults`: Number of document chunks to retrieve (default: 5)
- Chunk size in `scripts/ingest.ts` (default: 1000 chars)

### Style Changes

Edit `app/globals.css` to customize colors and layout.

## Troubleshooting

### "No results found"
- Ensure you've run `npm run ingest` after adding content
- Check that ChromaDB is running
- Verify content files are in `/content` directory

### "API Error"
- Check your API keys in `.env.local`
- Ensure you have API credits available

### Embeddings taking too long
- Consider using a local embedding model
- Reduce chunk size for faster processing

## Free Embedding Alternatives

Instead of OpenAI embeddings ($), you can use:

1. **Ollama** (local, free)
   ```bash
   ollama pull nomic-embed-text
   ```

2. **Hugging Face** (free API tier)
   - Use `@huggingface/inference` package

3. **Chroma's built-in** (uses Sentence Transformers)
   - Remove OpenAI dependency entirely
   - Use Chroma's default embedding function

## License

MIT
