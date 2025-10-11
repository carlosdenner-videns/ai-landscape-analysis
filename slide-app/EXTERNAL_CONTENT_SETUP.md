# External Content Configuration Guide

## Overview
The presentation app can load content from either local files or an external server/CDN. This allows you to update presentation content without rebuilding or redeploying the application.

---

## Configuration

### Environment Variable

Set `VITE_CONTENT_BASE_URL` in your `.env` file:

```bash
# .env file

# Option 1: Use local content (default)
VITE_CONTENT_BASE_URL=

# Option 2: Use external CDN/server
VITE_CONTENT_BASE_URL=https://cdn.example.com/presentations

# Option 3: Use GitHub raw content
VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/username/repo/main/content

# Option 4: Use your own API
VITE_CONTENT_BASE_URL=https://api.yoursite.com/slides
```

### How It Works

1. **If `VITE_CONTENT_BASE_URL` is empty or not set:**
   - App loads from local `/public/content/` folder
   - Requires rebuild to update content

2. **If `VITE_CONTENT_BASE_URL` is set:**
   - App fetches from external URL
   - No rebuild needed to update content
   - Just update files on the server/CDN

---

## Setup Options

### Option 1: GitHub Pages (Free & Easy)

**Step 1:** Create a separate GitHub repository for content
```bash
mkdir presentation-content
cd presentation-content
git init
```

**Step 2:** Add your JSON files
```
presentation-content/
├── content-en.json
├── content-es.json
├── content-pt.json
└── content-fr.json
```

**Step 3:** Push to GitHub
```bash
git add .
git commit -m "Initial content"
git push origin main
```

**Step 4:** Configure the app
```bash
# .env
VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/username/presentation-content/main
```

**Step 5:** Rebuild and deploy once
```bash
npm run build
# Deploy dist/ folder
```

**To Update Content:**
- Edit JSON files in the content repo
- Push changes to GitHub
- Content updates immediately (no app rebuild needed!)

---

### Option 2: AWS S3 + CloudFront (Production)

**Step 1:** Create S3 bucket
```bash
aws s3 mb s3://my-presentation-content
```

**Step 2:** Enable public read access (or use CloudFront)
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::my-presentation-content/*"
  }]
}
```

**Step 3:** Upload JSON files
```bash
aws s3 cp content-en.json s3://my-presentation-content/
aws s3 cp content-es.json s3://my-presentation-content/
aws s3 cp content-pt.json s3://my-presentation-content/
aws s3 cp content-fr.json s3://my-presentation-content/
```

**Step 4:** Configure CloudFront (optional but recommended)
- Create CloudFront distribution
- Point to S3 bucket
- Enable CORS

**Step 5:** Configure the app
```bash
# .env
VITE_CONTENT_BASE_URL=https://d1234567890.cloudfront.net
```

**To Update Content:**
```bash
aws s3 cp content-en.json s3://my-presentation-content/ --cache-control max-age=300
```

---

### Option 3: Netlify/Vercel Static Hosting (Simple)

**Step 1:** Create a separate project for content
```
content-repo/
├── content-en.json
├── content-es.json
├── content-pt.json
└── content-fr.json
```

**Step 2:** Deploy to Netlify/Vercel
```bash
# Using Netlify CLI
netlify deploy --dir=. --prod

# Using Vercel CLI
vercel --prod
```

**Step 3:** Configure the app
```bash
# .env
VITE_CONTENT_BASE_URL=https://my-content.netlify.app
```

**To Update Content:**
- Push changes to Git
- Auto-deploys via CI/CD
- Or use CLI: `netlify deploy --prod`

---

### Option 4: Custom API/CMS Backend

**Step 1:** Create API endpoint
```javascript
// Express.js example
app.get('/content-:lang.json', async (req, res) => {
  const { lang } = req.params;
  const content = await db.getContent(lang);
  res.json(content);
});
```

**Step 2:** Configure CORS
```javascript
app.use(cors({
  origin: 'https://your-presentation-app.com'
}));
```

**Step 3:** Configure the app
```bash
# .env
VITE_CONTENT_BASE_URL=https://api.yoursite.com
```

**To Update Content:**
- Update via admin panel
- Or API calls
- Changes reflect immediately

---

## CORS Configuration

### Important: Enable CORS on Your Server

Your external server must allow requests from your app's domain.

**For S3:**
```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://your-app-domain.com</AllowedOrigin>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

**For Express.js:**
```javascript
app.use(cors({
  origin: ['https://your-app-domain.com', 'http://localhost:5173']
}));
```

**For Nginx:**
```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods GET;
```

---

## File Structure Requirements

Your external server must serve files with these exact names:
- `content-en.json`
- `content-es.json`
- `content-pt.json`
- `content-fr.json`

The app will request: `{VITE_CONTENT_BASE_URL}/content-{language}.json`

---

## Caching Strategy

### For CDN/Static Hosting

**Short Cache (Frequent Updates):**
```bash
Cache-Control: max-age=300  # 5 minutes
```

**Long Cache (Stable Content):**
```bash
Cache-Control: max-age=3600  # 1 hour
```

**No Cache (Development):**
```bash
Cache-Control: no-cache, no-store, must-revalidate
```

### Cache Busting

Add version query parameter:
```bash
# .env
VITE_CONTENT_BASE_URL=https://cdn.example.com/presentations?v=1.0.0
```

Update version when content changes.

---

## Testing

### Test Local Content
```bash
# .env
VITE_CONTENT_BASE_URL=

npm run dev
```

### Test External Content
```bash
# .env
VITE_CONTENT_BASE_URL=https://your-cdn.com/content

npm run dev
```

### Test with Different Sources
```bash
# Test GitHub
VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/user/repo/main npm run dev

# Test S3
VITE_CONTENT_BASE_URL=https://s3.amazonaws.com/bucket npm run dev

# Test API
VITE_CONTENT_BASE_URL=https://api.example.com npm run dev
```

---

## Deployment Workflow

### One-Time Setup
1. Configure `.env` with external content URL
2. Build the app: `npm run build`
3. Deploy `dist/` folder to hosting (GitHub Pages, Netlify, etc.)

### Content Updates (No Rebuild!)
1. Edit JSON files on external server/CDN
2. Upload/push changes
3. Content updates immediately for all users
4. No need to rebuild or redeploy the app

### App Code Updates
1. Make code changes
2. Rebuild: `npm run build`
3. Redeploy `dist/` folder
4. Content remains on external server (unchanged)

---

## Advantages

✅ **Update content without rebuilding app**
✅ **Separate content from code deployments**
✅ **Use CDN for faster global delivery**
✅ **Version control content independently**
✅ **A/B test different content versions**
✅ **Centralized content management**
✅ **Reduced app bundle size**

---

## Security Considerations

### Public Content
- JSON files are publicly accessible
- Don't include sensitive data
- Use HTTPS for all requests

### Private Content
If you need authentication:
```javascript
// Add auth header in App.tsx
const response = await fetch(contentUrl, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Troubleshooting

### CORS Error
**Problem:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:** Enable CORS on your server (see CORS Configuration section)

### 404 Not Found
**Problem:** Content files not found

**Solution:** 
- Check file names match exactly: `content-en.json`, `content-es.json`, etc.
- Verify `VITE_CONTENT_BASE_URL` is correct
- Test URL directly in browser

### Content Not Updating
**Problem:** Old content still showing

**Solution:**
- Clear browser cache
- Check CDN cache settings
- Add version query parameter
- Use `Cache-Control: no-cache` during development

### Mixed Content Warning
**Problem:** Loading HTTP content from HTTPS app

**Solution:** Always use HTTPS for external content URLs

---

## Example Configurations

### Development
```bash
# .env.development
VITE_CONTENT_BASE_URL=http://localhost:3000/content
```

### Staging
```bash
# .env.staging
VITE_CONTENT_BASE_URL=https://staging-content.example.com
```

### Production
```bash
# .env.production
VITE_CONTENT_BASE_URL=https://cdn.example.com/presentations
```

---

## Migration Guide

### From Local to External

**Step 1:** Copy JSON files from `public/content/` to external server

**Step 2:** Update `.env`
```bash
VITE_CONTENT_BASE_URL=https://your-cdn.com
```

**Step 3:** Rebuild and test
```bash
npm run build
npm run preview
```

**Step 4:** Deploy

### From External to Local

**Step 1:** Download JSON files to `public/content/`

**Step 2:** Update `.env`
```bash
VITE_CONTENT_BASE_URL=
```

**Step 3:** Rebuild and deploy

---

## Best Practices

1. **Use CDN for production** - Faster global delivery
2. **Version your content** - Add version numbers to track changes
3. **Enable caching** - But keep TTL reasonable (5-60 minutes)
4. **Monitor errors** - Log failed content loads
5. **Have fallback** - Keep local content as backup
6. **Test before deploy** - Verify external URLs work
7. **Use HTTPS** - Always secure connections
8. **Document URLs** - Keep track of content locations

---

## Summary

With external content configuration, you can:
- ✅ Update presentations without rebuilding the app
- ✅ Use CDN for better performance
- ✅ Manage content separately from code
- ✅ Deploy once, update content many times

Just set `VITE_CONTENT_BASE_URL` in `.env` and you're ready to go!
