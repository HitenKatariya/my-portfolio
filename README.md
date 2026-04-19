# Portfolio Website

A modern personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, and reusable UI components.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI primitives
- Framer Motion

## Project Structure

- `app/` - App Router pages, layout, global styles, API routes
- `components/` - Reusable page and UI components
- `data/` - Static JSON data (career timeline)
- `lib/` - Shared constants, content, and utilities
- `public/` - Static assets
- `styles/` - Additional global styling

## Getting Started

### 1) Install dependencies

Using npm:

```bash
npm install
```

Using pnpm:

```bash
pnpm install
```

### 2) Run development server

Using npm:

```bash
npm run dev
```

Using pnpm:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run lint checks

## API Endpoints

- `POST /api/contact` - Contact form handler
- `GET /api/career` - Career data endpoint

## Deployment

This project can be deployed on Vercel or any Node.js hosting platform that supports Next.js.

Production build:

```bash
npm run build
npm run start
```

## Notes

- Keep portfolio text/content in `lib/constants` and `lib/content` for easier updates.
- Static media should be placed under `public/`.
