# Quick Start: Using GitHub as Free Content CDN

## Overview
Host your presentation content on GitHub and update it without rebuilding your app!

---

## Step-by-Step Setup (5 minutes)

### 1. Create Content Repository

```bash
# Create a new directory
mkdir presentation-content
cd presentation-content

# Initialize git
git init

# Copy your JSON files
cp ../slide-app/public/content/*.json .

# Create README
echo "# Presentation Content" > README.md
```

Your structure should look like:
```
presentation-content/
├── content-en.json
├── content-es.json
├── content-pt.json
├── content-fr.json
└── README.md
```

### 2. Push to GitHub

```bash
# Add files
git add .
git commit -m "Initial presentation content"

# Create repo on GitHub (via web or CLI)
gh repo create presentation-content --public

# Push
git push -u origin main
```

### 3. Get Raw Content URL

Your content will be available at:
```
https://raw.githubusercontent.com/YOUR_USERNAME/presentation-content/main/content-en.json
```

Base URL:
```
https://raw.githubusercontent.com/YOUR_USERNAME/presentation-content/main
```

### 4. Configure Your App

Edit `.env` in your slide-app:
```bash
VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/YOUR_USERNAME/presentation-content/main
```

### 5. Build and Deploy (One Time)

```bash
cd ../slide-app
npm run build

# Deploy dist/ folder to GitHub Pages, Netlify, Vercel, etc.
```

---

## Updating Content (No Rebuild!)

### Method 1: Via Git

```bash
cd presentation-content

# Edit your JSON files
nano content-en.json

# Commit and push
git add .
git commit -m "Update presentation content"
git push

# Content updates immediately! ✨
```

### Method 2: Via GitHub Web Interface

1. Go to your repository on GitHub
2. Click on the JSON file you want to edit
3. Click the pencil icon (Edit)
4. Make your changes
5. Commit directly to main
6. Done! Content updates immediately! ✨

### Method 3: Via GitHub API

```bash
# Using curl
curl -X PUT \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d @content-en.json \
  https://api.github.com/repos/YOUR_USERNAME/presentation-content/contents/content-en.json
```

---

## Example Workflow

### Initial Setup
```bash
# 1. Create content repo
mkdir presentation-content && cd presentation-content
git init

# 2. Add JSON files
cp ../slide-app/public/content/*.json .

# 3. Push to GitHub
git add . && git commit -m "Initial content"
gh repo create presentation-content --public
git push -u origin main

# 4. Configure app
cd ../slide-app
echo "VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/YOUR_USERNAME/presentation-content/main" > .env

# 5. Build and deploy once
npm run build
# Deploy dist/ folder
```

### Daily Updates
```bash
# Edit content
cd presentation-content
nano content-en.json

# Push changes
git add . && git commit -m "Update slides" && git push

# That's it! No app rebuild needed! 🎉
```

---

## Real Example

Let's say your GitHub username is `carlos-videns`:

**Content Repository:**
```
https://github.com/carlos-videns/presentation-content
```

**Raw Content URL:**
```
https://raw.githubusercontent.com/carlos-videns/presentation-content/main
```

**Your `.env` file:**
```bash
VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/carlos-videns/presentation-content/main
```

**Content Files Available At:**
- `https://raw.githubusercontent.com/carlos-videns/presentation-content/main/content-en.json`
- `https://raw.githubusercontent.com/carlos-videns/presentation-content/main/content-es.json`
- `https://raw.githubusercontent.com/carlos-videns/presentation-content/main/content-pt.json`
- `https://raw.githubusercontent.com/carlos-videns/presentation-content/main/content-fr.json`

---

## Advantages

✅ **Free** - GitHub hosting is free for public repos
✅ **Fast** - GitHub's CDN is globally distributed
✅ **Version Control** - Full git history of all changes
✅ **Easy Updates** - Edit via web interface or git
✅ **No Rebuild** - Update content without touching the app
✅ **Rollback** - Revert to any previous version easily

---

## Advanced: Multiple Versions

### Use Branches for Different Versions

```bash
# Create production branch
git checkout -b production
git push -u origin production

# Create staging branch
git checkout -b staging
git push -u origin staging
```

**Production App:**
```bash
VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/YOUR_USERNAME/presentation-content/production
```

**Staging App:**
```bash
VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/YOUR_USERNAME/presentation-content/staging
```

### Use Tags for Releases

```bash
# Tag a release
git tag v1.0.0
git push --tags
```

**Use specific version:**
```bash
VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/YOUR_USERNAME/presentation-content/v1.0.0
```

---

## Troubleshooting

### Content Not Updating?

**Problem:** Changes not showing immediately

**Solution:** GitHub raw content has a 5-minute cache. Wait a few minutes or add cache-busting:
```bash
VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/YOUR_USERNAME/presentation-content/main?v=2
```
Increment `v=2` to `v=3` when you update content.

### CORS Issues?

**Solution:** GitHub raw content already has CORS enabled. No configuration needed!

### 404 Error?

**Solution:** Check:
- Repository is public (or you're authenticated)
- Branch name is correct (usually `main` or `master`)
- File names match exactly: `content-en.json`, etc.

---

## Security Note

⚠️ **Public Repository = Public Content**

If your content is sensitive:
1. Use a private repository
2. Use GitHub tokens for authentication
3. Or use a different hosting solution (AWS S3, etc.)

For public presentations, this is perfect! ✅

---

## Cost

**GitHub:** FREE ✨
- Unlimited public repositories
- Unlimited bandwidth for raw content
- Global CDN included

---

## Summary

1. Create content repo on GitHub
2. Set `VITE_CONTENT_BASE_URL` in `.env`
3. Build and deploy app once
4. Update content anytime via GitHub (no rebuild!)

**That's it!** You now have a free, fast, version-controlled content delivery system! 🚀
