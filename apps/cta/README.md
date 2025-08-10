# Buildora Enterprise CTA Site

A responsive call-to-action micro-site for Buildora Enterprise, built with React, TypeScript, Vite, and TailwindCSS.

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Vercel Deployment

### Setup Instructions

1. **Create New Project**

   - Go to Vercel dashboard
   - Click "New Project"
   - Import your Git repository

2. **Configure Project Settings**

   - **Root Directory**: `apps/cta`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Deploy**

   - Click "Deploy"
   - Wait for build to complete

4. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add `cta.buildoraenterprise.com`
   - Create CNAME record in your DNS settings pointing to Vercel

### Post-Deployment TODO

**Important**: After the initial deployment, you need to add the banner image manually:

1. Add `/apps/cta/public/banner.jpg` to your repository
2. Update `/apps/cta/src/components/Banner.tsx`:
   - Replace the remote URL with `/banner.jpg`
   - Remove the TODO comment
3. Commit and push the changes

```tsx
// Replace this line in Banner.tsx:
src =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=60";

// With this:
src = "/banner.jpg";
```

## Features

- ✅ Responsive design (mobile-first)
- ✅ Form validation and submission
- ✅ SEO optimized with meta tags
- ✅ Accessible components
- ✅ Brand-consistent styling
- ✅ TypeScript for type safety
- ✅ Fast build with Vite

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Vercel** - Deployment platform

## Project Structure

```
apps/cta/
├── public/
│   ├── logo-wordmark.svg     # Buildora Enterprise text logo
│   └── logo-monogram.svg     # BE monogram logo
├── src/
│   ├── components/
│   │   ├── Header.tsx        # Site header with logos
│   │   ├── Hero.tsx          # Main headline section
│   │   ├── TrustTags.tsx     # Trust indicators
│   │   ├── Form.tsx          # Lead capture form
│   │   ├── Banner.tsx        # Bottom banner image
│   │   └── Footer.tsx        # Site footer
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # React entry point
│   └── styles.css            # Global styles + Tailwind
├── index.html                # HTML template with SEO tags
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```
