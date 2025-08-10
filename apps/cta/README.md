# Buildora Enterprise CTA Micro-Site

A responsive Call-To-Action page for Buildora Enterprise built with React + TypeScript + Vite + TailwindCSS.

## Features

- **Responsive Design**: Mobile-first design with desktop two-column layout
- **Brand Consistent**: Uses Buildora Enterprise colors and typography
- **Form Validation**: Client-side validation with error handling
- **Trust Indicators**: Professional trust badges and social proof
- **Optimized**: Fast loading with proper SEO and OG tags

## Development

```bash
npm install
npm run dev
```

## Deployment to Vercel

### Option 1: Via Vercel Dashboard

1. Create new project in Vercel dashboard
2. Import the same repository
3. Configure build settings:
   - **Root Directory**: `apps/cta`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy

### Option 2: Via Vercel CLI

```bash
cd apps/cta
npx vercel --prod
```

### Custom Domain Setup

1. In Vercel project settings, add custom domain: `cta.buildoraenterprise.com`
2. Create DNS CNAME record pointing to Vercel:
   ```
   CNAME cta.buildoraenterprise.com -> cname.vercel-dns.com
   ```

## TODO

- [ ] **Replace Banner Image**: After deployment, replace the remote banner URL with `/public/banner.jpg`
  - Current: Remote Unsplash URL (temporary)
  - Target: `/public/banner.jpg` (upload actual project image)
  - Location: `src/components/Banner.tsx` line 7

## File Structure

```
apps/cta/
├── src/
│   ├── components/
│   │   ├── Header.tsx      # Logo and branding
│   │   ├── Hero.tsx        # Main headline
│   │   ├── TrustTags.tsx   # Trust indicators
│   │   ├── Form.tsx        # Lead capture form
│   │   └── Banner.tsx      # Bottom banner image
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── public/
│   ├── logo-wordmark.svg   # Buildora Enterprise logo
│   └── logo-monogram.svg   # BE monogram
└── package.json
```

## Colors

- **Gold**: #C69B4B (primary brand color)
- **Gold Hover**: #B1873E
- **Background**: #e8e8e8
- **Text**: #333132
- **White**: #FFFFFF
