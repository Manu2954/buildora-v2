# Buildora Enterprise CTA

Deploy on Vercel:

1. Create a new Vercel project and import this repository.
2. Set **Root Directory** to `apps/cta`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Add domain `cta.buildoraenterprise.com`.
6. Create a DNS CNAME for `cta` pointing to Vercel; SSL will be provisioned automatically.
