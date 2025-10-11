# Content Editing Guide for AI Agents

## Overview
This repository contains the presentation content for the AI Landscape Analysis presentation. Edit these JSON files to update the live presentation without rebuilding the app.

---

## Repository Structure

```
presentation-content/
├── content-en.json      # English version
├── content-es.json      # Spanish version
├── content-pt.json      # Portuguese version
├── content-fr.json      # French version
└── assets/              # Images and media files
    ├── slide1_agenda_row.svg
    ├── slide2_collage_8x_v2.svg
    └── ...
```

---

## JSON Structure

### **Root Object**
```json
{
  "meta": {
    "author": "Carlos Denner - VIDENS Analytics",
    "version": "4.2.0",
    "description": "Presentation description",
    "duration": "90 minutes",
    "slides": 16
  },
  "segments": [
    // Array of slide objects
  ]
}
```

### **Slide Object (Title Slide)**
```json
{
  "id": "seg-1",                    // Unique ID (required)
  "title": "Main Title",            // Main title (required)
  "subtitle": "Subtitle text",      // Optional subtitle
  "bullets": [],                    // Empty for title slides
  "dimensions": [                   // Optional: for title slides
    {
      "icon": "🎯",
      "title": "Strategic",
      "description": "Vision & Planning"
    }
  ],
  "keyMessage": "Key takeaway",     // Optional
  "media": [],                      // Array of media objects
  "engagement": {                   // Optional
    "prompt": "Question for audience"
  },
  "citations": [],                  // Array of citation objects
  "notes": "Presenter notes",       // Optional
  "presenter": {                    // Only for first slide
    "name": "email@example.com",
    "title": "Expert in AI",
    "organization": "Organization",
    "date": "Date",
    "conference": "Conference name"
  },
  "isTitle": true                   // Mark as title slide
}
```

### **Slide Object (Content Slide)**
```json
{
  "id": "seg-1-2",                  // Unique ID (required)
  "title": "Slide Title",           // Main title (required)
  "subtitle": "Optional subtitle",  // Optional
  "bullets": [                      // Array of bullet points
    "First bullet point",
    "Second bullet point",
    "Third bullet point"
  ],
  "keyMessage": "Key takeaway",     // Optional
  "media": [                        // Array of media objects
    {
      "type": "image",
      "src": "https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master/assets/image.svg",
      "alt": "Image description",
      "caption": "Optional caption"
    }
  ],
  "engagement": {                   // Optional "Think About This"
    "prompt": "Question for audience?"
  },
  "citations": [],                  // Optional references
  "notes": "Presenter notes here"   // Optional
}
```

---

## Field Definitions

### **Required Fields**
- `id` (string): Unique identifier for the slide
- `title` (string): Main slide title
- `bullets` (array): Array of strings (can be empty for title slides)

### **Optional Fields**
- `subtitle` (string): Subtitle text
- `keyMessage` (string): Main takeaway
- `notes` (string): Presenter notes (shown when pressing P)
- `isTitle` (boolean): Set to `true` for title slides

### **Media Object**
```json
{
  "type": "image",                  // "image", "videoLocal", "videoYouTube", "embed"
  "src": "URL or path",             // Image URL or path
  "alt": "Description",             // Accessibility text (required)
  "caption": "Optional caption"     // Optional caption text
}
```

**Image URL formats:**
- GitHub: `https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master/assets/image.svg`
- Relative: `assets/image.svg` (if bundled in app)
- External: `https://example.com/image.png`

### **Engagement Object**
```json
{
  "prompt": "What do you think about this?"
}
```
This creates a "Think About This" section at the bottom of the slide.

### **Citation Object**
```json
{
  "label": "Source name",
  "url": "https://example.com/source"
}
```

---

## Common Tasks

### **1. Add a New Slide**

Add a new object to the `segments` array:

```json
{
  "id": "seg-new-1",
  "title": "New Slide Title",
  "subtitle": "Optional subtitle",
  "bullets": [
    "First point",
    "Second point",
    "Third point"
  ],
  "media": [
    {
      "type": "image",
      "src": "https://raw.githubusercontent.com/carlosdenner-videns/presentation-content/master/assets/new_image.svg",
      "alt": "Description"
    }
  ],
  "engagement": {
    "prompt": "What are your thoughts?"
  },
  "notes": "Presenter notes for this slide"
}
```

**Important:** 
- Use a unique `id`
- Update `meta.slides` count
- Position in array determines slide order

---

### **2. Edit Existing Slide**

Find the slide by `id` or `title` and modify fields:

```json
{
  "id": "seg-1-2",
  "title": "Updated Title",        // ← Changed
  "bullets": [
    "Updated bullet 1",             // ← Changed
    "Updated bullet 2",             // ← Changed
    "New bullet 3"                  // ← Added
  ]
}
```

---

### **3. Remove a Slide**

Delete the entire slide object from the `segments` array and update the count:

```json
{
  "meta": {
    "slides": 15  // ← Decreased from 16
  },
  "segments": [
    // Removed one slide object
  ]
}
```

---

### **4. Reorder Slides**

Change the position of slide objects in the `segments` array. The order in the array is the order in the presentation.

---

### **5. Update an Image**

**Option A: Replace image file**
1. Upload new image to `/assets/` with same filename
2. No JSON changes needed

**Option B: Change image reference**
```json
{
  "media": [
    {
      "type": "image",
      "src": "https://raw.githubusercontent.com/.../new_image.svg",  // ← Changed
      "alt": "Updated description"
    }
  ]
}
```

---

### **6. Add/Edit Bullet Points**

```json
{
  "bullets": [
    "Existing bullet 1",
    "Existing bullet 2",
    "New bullet 3",        // ← Added
    "New bullet 4"         // ← Added
  ]
}
```

---

### **7. Add "Think About This" Section**

```json
{
  "engagement": {
    "prompt": "How would you apply this in your organization?"
  }
}
```

---

### **8. Add Presenter Notes**

```json
{
  "notes": "Remember to emphasize the key points. Pause for questions here."
}
```

---

## Multi-Language Support

Edit the same slide across all language files:

**content-en.json:**
```json
{
  "id": "seg-1-2",
  "title": "Where is AI today?",
  "bullets": ["Point 1", "Point 2"]
}
```

**content-es.json:**
```json
{
  "id": "seg-1-2",
  "title": "¿Dónde está la IA hoy?",
  "bullets": ["Punto 1", "Punto 2"]
}
```

**Important:** Keep the same `id` across all languages for the same slide.

---

## Validation Rules

### ✅ **Do:**
- Use unique IDs for each slide
- Keep IDs consistent across languages
- Include `alt` text for all images
- Use valid JSON syntax
- Test JSON validity before committing

### ❌ **Don't:**
- Duplicate IDs
- Leave required fields empty
- Use invalid JSON syntax
- Include very large images (>1MB)
- Use special characters in IDs

---

## Testing Your Changes

### **1. Validate JSON**
Use a JSON validator: https://jsonlint.com/

### **2. Check Locally**
```bash
# View the file
cat content-en.json

# Validate with jq (if installed)
jq . content-en.json
```

### **3. Preview Changes**
After committing, wait ~5 minutes for GitHub cache, then check:
https://carlosdenner-videns.github.io/ai-landscape-analysis/

---

## Git Workflow

### **Basic Workflow:**
```bash
# 1. Make changes to JSON files
nano content-en.json

# 2. Check what changed
git diff

# 3. Stage changes
git add content-en.json

# 4. Commit with descriptive message
git commit -m "Add new slide about AI ethics"

# 5. Push to GitHub
git push

# 6. Wait ~5 minutes for cache
# 7. Changes are live!
```

### **Best Practices:**
- Write clear commit messages
- Make one logical change per commit
- Test JSON validity before committing
- Update all language versions together

---

## Common Patterns

### **Slide with Image and Bullets**
```json
{
  "id": "seg-example",
  "title": "Main Point",
  "subtitle": "Supporting context",
  "bullets": [
    "Key insight 1",
    "Key insight 2",
    "Key insight 3"
  ],
  "media": [
    {
      "type": "image",
      "src": "https://raw.githubusercontent.com/.../diagram.svg",
      "alt": "Diagram showing the concept",
      "caption": "Figure 1: Overview"
    }
  ],
  "notes": "Spend 2 minutes on this slide"
}
```

### **Slide with Multiple Images**
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
Users can navigate between images with Prev/Next buttons.

### **Slide with Engagement Question**
```json
{
  "title": "Discussion Point",
  "bullets": [
    "Context point 1",
    "Context point 2"
  ],
  "engagement": {
    "prompt": "How does this apply to your work?"
  }
}
```

---

## Troubleshooting

### **Changes not appearing?**
1. Wait 5 minutes (GitHub cache)
2. Hard refresh browser (Ctrl+F5)
3. Check JSON syntax is valid
4. Verify commit was pushed to GitHub

### **JSON syntax error?**
1. Use https://jsonlint.com/ to find the error
2. Common issues:
   - Missing comma between objects
   - Extra comma after last item
   - Unescaped quotes in strings
   - Missing closing bracket

### **Image not showing?**
1. Verify image URL is correct
2. Check image file exists in `/assets/`
3. Ensure image is accessible (public)
4. Check `alt` text is provided

---

## Quick Reference

### **Minimum Viable Slide**
```json
{
  "id": "unique-id",
  "title": "Title",
  "bullets": []
}
```

### **Full-Featured Slide**
```json
{
  "id": "unique-id",
  "title": "Title",
  "subtitle": "Subtitle",
  "bullets": ["Point 1", "Point 2"],
  "media": [{
    "type": "image",
    "src": "URL",
    "alt": "Description"
  }],
  "engagement": {
    "prompt": "Question?"
  },
  "notes": "Notes",
  "keyMessage": "Takeaway"
}
```

---

## Summary

**To update the presentation:**
1. Edit JSON files in this repository
2. Commit and push changes
3. Wait ~5 minutes
4. Changes are live!

**No app rebuild needed!** ✨

---

## Support

**Repository:** https://github.com/carlosdenner-videns/presentation-content
**Live Site:** https://carlosdenner-videns.github.io/ai-landscape-analysis/
**JSON Validator:** https://jsonlint.com/
