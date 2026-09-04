# Nuxt Content Starter

Look at the [Nuxt Content documentation](https://content.nuxt.com) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Traveller reviews

The public review form at `/share-your-story` is moderated: a submission stays
private until a Tripport Manager approves it and creates a testimonial draft.

Before enabling review submissions in a new environment:

1. Apply `supabase/migrations/202608250001_public_testimonial_submissions.sql` after the existing manager migrations.
2. Set `NUXT_SUPABASE_SERVICE_ROLE_KEY` in local `.env` and as a Cloudflare Worker secret. This is server-only—never use a `NUXT_PUBLIC_` variable or commit its value.
3. Keep the existing public Supabase URL and publishable key configured for the browser upload client.

The form accepts one JPG, PNG, or WebP photo (up to 8 MB) and one MP4, WebM,
or MOV video (up to 25 MB). Attachments are stored in a private bucket until
the review is approved.

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
