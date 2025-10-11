# GitHub Actions Deployment Fix

## ✅ **Issue Fixed!**

### **Problem:**
The GitHub Actions workflow was failing with:
```
The process '/usr/bin/git' failed with exit code 128
```

### **Root Cause:**
The `.env` file (containing `VITE_CONTENT_BASE_URL`) is gitignored and not available in the CI environment. The build was trying to use the environment variable but couldn't find it.

### **Solution:**
Added the environment variable directly to the GitHub Actions workflow:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_CONTENT_BASE_URL: https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master
```

---

## **What Happens Now:**

1. ✅ **Automatic Deployment** - Every push to `main` triggers deployment
2. ✅ **Content from GitHub** - App loads content from external repo
3. ✅ **No Manual Build** - GitHub Actions handles everything

---

## **Deployment Workflow:**

```
Push to main branch
    ↓
GitHub Actions triggered
    ↓
Install dependencies (npm ci)
    ↓
Build with external content URL
    ↓
Upload to GitHub Pages
    ↓
Deploy automatically
    ↓
Live at: https://carlosdenner-videns.github.io/ai-landscape-analysis/
```

---

## **How to Update Content:**

### **Update Slides/Text:**
1. Edit JSON on: https://github.com/carlosdenner-videns/presentation-content
2. Commit changes
3. **Done!** Changes appear immediately (~5 min cache)
4. **No app redeployment needed!**

### **Update Images:**
1. Upload to: https://github.com/carlosdenner-videns/presentation-content/tree/master/assets
2. Update JSON if needed
3. **Done!** Images update immediately

### **Update App Code:**
1. Make changes in `slide-app/`
2. Commit and push to `main`
3. GitHub Actions automatically rebuilds and deploys
4. **Done!** New version live in ~2 minutes

---

## **Monitoring Deployments:**

**Check deployment status:**
https://github.com/carlosdenner-videns/ai-landscape-analysis/actions

**Live site:**
https://carlosdenner-videns.github.io/ai-landscape-analysis/

---

## **Environment Variables:**

### **Local Development (.env):**
```bash
VITE_CONTENT_BASE_URL=https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master
```

### **GitHub Actions (deploy.yml):**
```yaml
env:
  VITE_CONTENT_BASE_URL: https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master
```

Both use the same URL to ensure consistency!

---

## **Troubleshooting:**

### **Deployment Still Failing?**

**Check 1:** View the Actions log
- Go to: https://github.com/carlosdenner-videns/ai-landscape-analysis/actions
- Click on the latest workflow run
- Check for errors

**Check 2:** Verify GitHub Pages is enabled
- Go to repository Settings → Pages
- Source should be "GitHub Actions"

**Check 3:** Check permissions
- Workflow has correct permissions (already set)

### **Content Not Loading?**

**Check 1:** Verify content repo is public
- https://github.com/carlosdenner-videns/presentation-content
- Should be accessible without login

**Check 2:** Check URLs in browser
- Open: https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master/content-en.json
- Should show JSON content

**Check 3:** Check browser console (F12)
- Look for CORS or 404 errors

---

## **Summary:**

✅ **Deployment workflow fixed**
✅ **Environment variable added to CI**
✅ **Automatic deployments enabled**
✅ **Content loads from external GitHub repo**

**Your app will now deploy automatically on every push!** 🚀
