# Tripport Nuxt Starter

Nuxt 4 starter configured with Tailwind CSS, GSAP, lucide icons, React packages, and Cloudflare Workers deployment through Wrangler.

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
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

## Cloudflare

```bash
npm run cf:dev
```

Deploy with:

```bash
npm run cf:deploy
```

The Nuxt/Nitro config uses the `cloudflare_module` preset for Cloudflare Workers. Log in first with `npx wrangler login` if this machine is not authenticated.
