# Deployment Guide - FitLearned

## 🚀 Deployment Options

### 1. Vercel (Recommended)

#### Automatic Deployment
1. Push code ke GitHub repository
2. Connect repository ke Vercel
3. Vercel akan auto-deploy setiap push ke main branch

#### Manual Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
\`\`\`

#### Vercel Configuration
Create `vercel.json`:
\`\`\`json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "app/**/*.tsx": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
\`\`\`

### 2. Netlify

#### Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: 18

#### Netlify Configuration
Create `netlify.toml`:
\`\`\`toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
\`\`\`

#### Deploy Steps
\`\`\`bash
# Build for static export
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=out
\`\`\`

### 3. GitHub Pages

#### Setup
1. Enable GitHub Pages in repository settings
2. Set source to GitHub Actions

#### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
\`\`\`

### 4. Firebase Hosting

#### Setup
\`\`\`bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
\`\`\`

#### Firebase Configuration
`firebase.json`:
\`\`\`json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
\`\`\`

#### Deploy
\`\`\`bash
# Build
npm run build

# Deploy
firebase deploy
\`\`\`

### 5. AWS S3 + CloudFront

#### S3 Setup
1. Create S3 bucket
2. Enable static website hosting
3. Upload `out/` folder contents

#### CloudFront Setup
1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure custom error pages

#### Deploy Script
\`\`\`bash
#!/bin/bash
# build.sh

# Build project
npm run build

# Sync to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
\`\`\`

## ⚙️ Build Configuration

### Next.js Configuration
`next.config.mjs`:
\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fitlearned' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/fitlearned' : '',
}

export default nextConfig
\`\`\`

### Package.json Scripts
\`\`\`json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next export",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod --dir=out",
    "deploy:firebase": "firebase deploy"
  }
}
\`\`\`

## 🔧 Environment Setup

### Development
\`\`\`bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### Production
\`\`\`bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

## 📊 Performance Optimization

### Build Optimization
\`\`\`bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
\`\`\`

### Image Optimization
\`\`\`javascript
// next.config.mjs
const nextConfig = {
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  }
}
\`\`\`

### Caching Strategy
\`\`\`javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
\`\`\`

## 🔍 Monitoring & Analytics

### Vercel Analytics
\`\`\`javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

### Google Analytics
\`\`\`javascript
// lib/gtag.js
export const GA_TRACKING_ID = 'G-XXXXXXXXXX'

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}
\`\`\`

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
\`\`\`bash
# Clear cache
rm -rf .next
npm run build

# Check Node version
node --version  # Should be 18+
\`\`\`

#### 2. Static Export Issues
\`\`\`bash
# Ensure no server-side features
# Remove API routes if using static export
# Check for dynamic imports
\`\`\`

#### 3. Routing Issues
\`\`\`bash
# Add trailing slashes
trailingSlash: true

# Configure rewrites
rewrites: [
  { source: '/(.*)', destination: '/index.html' }
]
\`\`\`

#### 4. Asset Loading Issues
\`\`\`bash
# Check asset prefix
assetPrefix: '/your-subdirectory'

# Verify public folder structure
public/
  ├── images/
  ├── icons/
  └── favicon.ico
\`\`\`

## 📋 Pre-deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Build completes successfully
- [ ] No console errors in production

### Performance
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] Loading times under 3 seconds
- [ ] Lighthouse score > 90

### Functionality
- [ ] All features working
- [ ] File upload/download working
- [ ] Search and filters working
- [ ] Responsive design tested

### SEO & Accessibility
- [ ] Meta tags configured
- [ ] Alt text for images
- [ ] Proper heading structure
- [ ] Keyboard navigation working

### Security
- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] XSS protection in place
- [ ] HTTPS configured

## 🔄 CI/CD Pipeline

### GitHub Actions Example
\`\`\`yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run lint
    - run: npm run build
    
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
\`\`\`

## 📞 Support

Jika mengalami masalah deployment:
1. Check dokumentasi platform hosting
2. Review build logs untuk error messages
3. Test build locally terlebih dahulu
4. Contact: fitrah.andhika@email.com

---

**Deployment Guide v1.0.0**

*Happy Deploying! 🚀*
