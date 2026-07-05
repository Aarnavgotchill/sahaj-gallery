# sahaj-gallery

This is a **quick deployment guide** to get your site up on Cloudflare Pages.

## 🎯 QUICK SOLUTION - DEPLOY IN 3 STEPS

### Step 1: Set Environment Variable
```bash
# Run in PowerShell (with proper syntax)
$env:VITE_R2_URL = "https://pub-88b77a3c95f846c492b24221cd5ed074.r2.dev"
```

### Step 2: Build the Project
```bash
# Build with R2 configuration
cd "C:\Users\aarna\OneDrive\Desktop\sahaj website"
npm run build
```

### Step 3: Deploy
```bash
# Deploy the built project (Cloudflare Pages)
cd "C:\Users\aarna\OneDrive\Desktop\sahaj website"
npx wrangler@4.104.0 pages deploy dist --project-name=sahaj-gallery

# Or deploy to Vercel production
npx vercel --prod
```
