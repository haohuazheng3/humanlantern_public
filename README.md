# Human Lantern

Honest, research-backed guidance for working, earning and thinking clearly in the age of AI, and the home of the field manual *What AI Can't Take From You* (English, German and Japanese editions). Live at [humanlantern.com](https://humanlantern.com).

This repository is the complete web app: a statically generated, trilingual content site (English at `/`, German at `/de`, Japanese at `/ja`) with a free sample of the book, an interactive Situation Finder, a blog system, guest checkout (no accounts: buyers pay with their email), and private delivery of a personalized PDF in all three editions.

## Stack

- **Next.js 16** (App Router, React 19) and **Tailwind CSS v4**; one page tree under `src/app/[lang]`, with unprefixed English URLs rewritten in `next.config.ts` (no middleware on public pages)
- **Neon Postgres** with **Drizzle ORM** (HTTP driver; migrations in `drizzle/`)
- **Clerk** only for the owner's admin sign-in; buyers never sign in
- **Stripe Checkout** for the one-time guest purchase, in the buyer's language; the success page verifies the session server-side and unlocks all three editions on the spot, a signed webhook is the fallback, and a reconcile job compares Stripe with the database
- **Resend** (optional) emails each buyer their watermarked PDF exactly once per order; signed links let them read or download it again
- **Cloudflare**: R2 for private files behind a small Worker that serves short-lived HMAC-signed links, and an Email Worker for a test inbox and owner alerts
- Self-hosted error inbox, health endpoint with a scheduled self-check, Postgres rate limiting, and MDX articles with automatic internal links and structured data

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values for your own services
npm run db:migrate           # creates the tables in your Postgres database
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` | Applies migrations (if a database is configured), then builds |
| `npm run check` | Type check, lint and unit tests |
| `npm run db:generate` | Generates a SQL migration after a schema change |
| `npm run icons` | Regenerates every favicon and app icon from the logo mark |

The book data the site reads lives in `content/book/public/<lang>.json` (table of contents with page numbers, the opening pages, the Situation Finder and the free Part 1). The full manuscript and the PDFs are not part of this repository.

The Cloudflare Workers live in `infra/workers` (`mail/` and `files/`); deploy them with Wrangler after creating your own `wrangler.toml` for each (bindings: an R2 bucket for files; a `send_email` binding for mail).

## Writing articles

Each article is one file at `content/blog/<lang>/<category>/<slug>.mdx` with frontmatter (`title`, `description`, `publishedAt`, `updatedAt`, `keywords`, `chapters`, `faq`, `draft`). See `content/blog/en/ai-and-jobs/article-template.mdx` for the available blocks (Evidence, Prompt, Drill, Mistake, Compare, Say, Truth, BookCTA, Photo). Category hubs, the sitemap and `llms.txt` update on the next build; hubs without articles stay out of the index.

## License

The code is MIT licensed (see `LICENSE`). The book, the brand and the written content are not.
