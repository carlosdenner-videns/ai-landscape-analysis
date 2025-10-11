# How to Update Images via JSON

## ✅ **Setup Complete!**

I've already set up your images to be hosted on GitHub alongside your content. Now you can update images without rebuilding the app!

---

## **Current Setup**

### **GitHub Repository Structure:**
```
presentation-content/
├── content-en.json
├── content-es.json
├── content-pt.json
├── content-fr.json
└── assets/
    ├── slide1_agenda_row.svg
    ├── slide2_collage_8x_v2.svg
    ├── slide3_yes_no_cards.svg
    ├── slide4_balanza_v2.svg
    ├── slide5_timeline.svg
    ├── slide6_mapa_politicas_v2.svg
    ├── slide7_dato_unico_v2.svg
    ├── slide8_temas_conectados.svg
    └── slide9_badges.svg
```

### **Image URLs:**
Your images are now available at:
```
https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master/assets/IMAGE_NAME.svg
```

---

## **How to Update Images**

### **Option 1: Replace Existing Image**

**Steps:**
1. Go to: https://github.com/carlosdenner-videns/presentation-content/tree/master/assets
2. Click on the image you want to replace (e.g., `slide2_collage_8x_v2.svg`)
3. Click the trash icon to delete it
4. Click "Add file" → "Upload files"
5. Upload your new image **with the same filename**
6. Commit changes
7. **Done!** Image updates automatically (~5 min cache)

**No JSON changes needed** - same filename means same reference!

---

### **Option 2: Add New Image**

**Steps:**
1. Go to: https://github.com/carlosdenner-videns/presentation-content/tree/master/assets
2. Click "Add file" → "Upload files"
3. Upload your new image (e.g., `new_diagram.svg`)
4. Commit changes
5. Edit the JSON file to reference it:

```json
{
  "media": [
    {
      "type": "image",
      "src": "https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master/assets/new_diagram.svg",
      "alt": "Description of image",
      "caption": "Optional caption"
    }
  ]
}
```

6. Commit JSON changes
7. **Done!** New image appears in presentation

---

### **Option 3: Change Image for a Slide**

**Example:** Change the image on slide "Where is AI today?"

**Steps:**
1. Go to: https://github.com/carlosdenner-videns/presentation-content
2. Click `content-en.json` (or whichever language)
3. Click the pencil icon (✏️ Edit)
4. Find the slide (search for the title)
5. Update the `src` field:

**Before:**
```json
{
  "id": "seg-1-2",
  "title": "Where is AI today?",
  "media": [
    {
      "type": "image",
      "src": "assets/slide2_collage_8x_v2.svg",
      "alt": "Collage of AI uses"
    }
  ]
}
```

**After (using GitHub-hosted image):**
```json
{
  "id": "seg-1-2",
  "title": "Where is AI today?",
  "media": [
    {
      "type": "image",
      "src": "https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master/assets/slide2_collage_8x_v2.svg",
      "alt": "Collage of AI uses"
    }
  ]
}
```

6. Scroll down and click "Commit changes"
7. **Done!** Image updates automatically

---

## **Image Source Options**

You can use images from multiple sources:

### **1. GitHub (Current Setup)**
```json
"src": "https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master/assets/image.svg"
```
✅ Free hosting
✅ Version controlled
✅ Easy to update

### **2. Local (App Assets)**
```json
"src": "assets/image.svg"
```
⚠️ Requires app rebuild to add new images
✅ Works offline
✅ Faster load (bundled)

### **3. External URL**
```json
"src": "https://example.com/images/diagram.png"
```
✅ No storage limits
✅ Can use CDN
⚠️ Requires external hosting

### **4. Data URL (Embedded)**
```json
"src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIi..."
```
✅ No external requests
⚠️ Makes JSON file larger
⚠️ Harder to edit

---

## **Supported Image Formats**

- ✅ **SVG** (recommended - scalable, small file size)
- ✅ **PNG** (good for photos/screenshots)
- ✅ **JPG/JPEG** (good for photos)
- ✅ **WebP** (modern, efficient)
- ✅ **GIF** (animations)

---

## **Best Practices**

### ✅ Do:
- Use SVG for diagrams, icons, illustrations
- Use descriptive filenames: `ai_governance_diagram.svg`
- Add meaningful `alt` text for accessibility
- Optimize images before uploading (compress)
- Use consistent naming convention

### ❌ Don't:
- Upload huge files (keep under 1 MB if possible)
- Use spaces in filenames (use `_` or `-`)
- Forget to add `alt` text
- Use copyrighted images without permission

---

## **Quick Reference**

### **Update Existing Image (Same Filename):**
```
1. Go to GitHub assets folder
2. Delete old image
3. Upload new image with same name
4. Commit
5. Done! (no JSON changes needed)
```

### **Add New Image:**
```
1. Upload to GitHub assets folder
2. Get URL: https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master/assets/FILENAME
3. Update JSON "src" field
4. Commit JSON
5. Done!
```

### **Change Image for Slide:**
```
1. Edit JSON on GitHub
2. Find slide by title
3. Change "src" to new image URL
4. Commit
5. Done!
```

---

## **Example: Complete Image Update**

Let's say you want to update the "AI in daily life" slide with a new diagram:

**Step 1:** Upload new image to GitHub
- Go to: https://github.com/carlosdenner-videns/presentation-content/tree/master/assets
- Upload `ai_daily_life_new.svg`

**Step 2:** Update JSON
- Edit `content-en.json`
- Find slide with `"id": "seg-1-2"`
- Change:
```json
"src": "https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master/assets/ai_daily_life_new.svg"
```

**Step 3:** Commit and wait
- Commit changes
- Wait ~5 minutes for GitHub cache
- **New image appears!** ✨

---

## **Troubleshooting**

### **Image not showing?**

**Check 1:** Verify URL is correct
- Copy the `src` URL and paste in browser
- Should download/display the image

**Check 2:** Check filename matches exactly
- Case-sensitive: `Image.svg` ≠ `image.svg`
- No typos in path

**Check 3:** Wait for cache
- GitHub caches for ~5 minutes
- Try adding `?v=2` to URL to force refresh

### **Image shows but looks wrong?**

**Check 1:** Verify image file is correct
- Download from GitHub and open locally
- Make sure it's the right image

**Check 2:** Check image dimensions
- Very large images may be slow
- Very small images may look pixelated

### **CORS error?**

**Solution:** GitHub raw content has CORS enabled
- If using external URL, make sure CORS is allowed
- GitHub URLs should work fine

---

## **Advanced: Multiple Images per Slide**

You can have multiple images on one slide:

```json
{
  "media": [
    {
      "type": "image",
      "src": "https://raw.githubusercontent.com/.../image1.svg",
      "alt": "First diagram"
    },
    {
      "type": "image",
      "src": "https://raw.githubusercontent.com/.../image2.svg",
      "alt": "Second diagram"
    }
  ]
}
```

Users can navigate between them with Prev/Next buttons.

---

## **Summary**

✅ **Images are now on GitHub** - Update without rebuilding app
✅ **Easy to update** - Just upload new file or edit JSON
✅ **Version controlled** - Full history of all changes
✅ **Free hosting** - GitHub provides unlimited bandwidth

**Your image repository:**
https://github.com/carlosdenner-videns/presentation-content/tree/master/assets

**Update images anytime, no app rebuild needed!** 🎉
