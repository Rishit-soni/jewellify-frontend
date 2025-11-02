# Netlify Deployment Guide

## Issue Fixed

The `inlineCriticalCss` schema validation error has been resolved by:
1. Creating `netlify.toml` to disable the Netlify Angular Runtime plugin
2. Removing the problematic `inlineCriticalCss` property from `angular.json`

## Files Modified

### 1. `netlify.toml` (NEW)
This file tells Netlify how to build and deploy your application:
- Disables the Angular Runtime plugin that was causing schema errors
- Specifies build command and output directory
- Adds SPA redirect rules

### 2. `angular.json` (UPDATED)
- Removed the `inlineCriticalCss` property from production configuration
- Configuration is now clean and compatible with Netlify

## Deployment Steps

### Step 1: Commit and Push

```bash
# Add the new files
git add netlify.toml angular.json

# Commit the changes
git commit -m "Fix: Netlify deployment with netlify.toml and clean angular.json"

# Push to your repository
git push origin main
```

### Step 2: Deploy on Netlify

#### Option A: Automatic Deployment (Recommended)

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select your `invoice-fe` repository
5. Netlify will automatically detect the settings from `netlify.toml`
6. Click "Deploy site"

**Important**: Netlify will use these settings from `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `dist/angular-playground/browser`

#### Option B: Manual Configuration

If Netlify doesn't pick up the `netlify.toml` settings:

1. In Netlify dashboard, go to Site settings → Build & deploy
2. Set the following:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/angular-playground/browser`
3. Go to Environment variables and add:
   - `NODE_VERSION`: `20`

### Step 3: Configure Environment Variables

For production deployment, you'll need to set your backend API URL:

1. In Netlify dashboard: Site settings → Environment variables
2. Add a new variable:
   - **Key**: `NG_APP_API_URL`
   - **Value**: `https://your-backend-api.com/api`

Then update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-backend-api.com/api'
};
```

### Step 4: Custom Domain (Optional)

1. In Netlify dashboard: Domain settings → Add custom domain
2. Follow the instructions to configure DNS
3. Netlify will automatically provision SSL certificate

## Build Verification

Before deploying, verify the build works locally:

```bash
# Clean build
npm run build

# Check the output
dir dist\angular-playground\browser  # Windows
ls -la dist/angular-playground/browser  # Linux/Mac
```

You should see:
- `index.html`
- JavaScript bundles (`.js` files)
- CSS files
- Assets folder

## Troubleshooting

### Build Fails on Netlify

1. **Check Node Version**
   - Add to `netlify.toml`:
     ```toml
     [build.environment]
       NODE_VERSION = "20"
     ```

2. **Check Build Logs**
   - Go to Netlify dashboard → Deploys → Click on failed deploy
   - Review the build logs for errors

3. **Clear Cache**
   - In Netlify: Site settings → Build & deploy → Post processing
   - Click "Clear cache and retry deploy"

### 404 Errors on Refresh

The `netlify.toml` includes redirect rules. If you still get 404s:

1. Verify the redirect rule in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Make sure `publish` directory is correct:
   ```toml
   publish = "dist/angular-playground/browser"
   ```

### API Calls Failing

1. Check browser console for CORS errors
2. Ensure backend allows requests from Netlify domain
3. Update environment variables in Netlify
4. Check that API URL in `environment.prod.ts` is correct

## Continuous Deployment

Once connected to Git:
- Every push to `main` branch triggers automatic deployment
- You can set up deploy previews for pull requests
- Branch deploys for testing different branches

### Configure Branch Deploys

In Netlify dashboard:
1. Go to Site settings → Build & deploy → Continuous deployment
2. Under "Deploy contexts", configure:
   - **Production branch**: `main`
   - **Branch deploys**: All branches or specific branches
   - **Deploy previews**: Automatically build deploy previews for pull requests

## Performance Optimization

### Enable Gzip Compression

Already handled by Netlify automatically.

### Enable Brotli Compression

Add to `netlify.toml`:
```toml
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true
```

### Cache Control

Add to `netlify.toml`:
```toml
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

## Monitoring

### Netlify Analytics

1. Go to Site overview → Analytics
2. Enable Netlify Analytics (paid feature)
3. Monitor traffic, performance, and errors

### Error Tracking

Consider integrating:
- Sentry
- LogRocket
- Rollbar

Add to `app.config.ts` for error tracking.

## Rollback

If deployment fails:

1. Go to Netlify dashboard → Deploys
2. Find the last working deploy
3. Click "..." → "Publish deploy"
4. Previous version will be live immediately

## Summary

✅ `netlify.toml` created - Disables problematic Angular plugin  
✅ `angular.json` cleaned - Removed `inlineCriticalCss`  
✅ SPA redirects configured  
✅ Ready for deployment  

**Next Steps**:
1. Commit and push changes
2. Connect to Netlify
3. Deploy automatically

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com/
- Angular Deployment: https://angular.dev/ecosystem/deployment
- Support: Check Netlify community forums
