# Slide Management Features

## Overview
The presentation app now includes comprehensive slide management capabilities:
- **Persistent Slide Reordering** - Drag and drop slides with changes saved to localStorage
- **Slide Deletion** - Remove slides you don't need for a specific presentation
- **Content Editing** - Edit bullet points directly in the presentation
- **Reset Functionality** - Restore original slide order and content

All changes are persisted per language in localStorage, so your customizations are maintained across sessions.

---

## Features

### 1. 🔄 Persistent Slide Reordering

**How it works:**
- Hover over any slide number in the progress bar
- Click and drag to reorder slides
- Changes are automatically saved to localStorage
- Order persists across page reloads

**Visual feedback:**
- Dragged slide becomes semi-transparent
- Drop target shows yellow ring highlight
- Cursor changes to indicate drag mode

**Storage:**
- Saved per language in `localStorage` key: `slideOrder_{language}`
- Includes both order and deleted slide IDs

---

### 2. ❌ Slide Deletion

**How to delete:**
1. Hover over any slide number in the progress bar
2. A red "×" button appears in the top-right corner
3. Click the "×" button
4. Confirm deletion in the dialog

**Protection:**
- Cannot delete the last remaining slide
- Confirmation dialog prevents accidental deletions
- Deleted slides can be restored using the Reset button

**Persistence:**
- Deletions are saved to localStorage
- Deleted slides remain hidden across sessions
- Each language has independent deletion state

---

### 3. ✏️ Content Editing (Bullet Points)

**How to edit:**
1. Navigate to any non-title slide with bullet points
2. Click the "✏️ Edit" button below the bullets
3. Edit text in the textarea fields
4. Add new bullets with "+ Add Bullet"
5. Remove bullets with the "×" button (minimum 1 bullet required)
6. Click "💾 Save" to save changes or "Cancel" to discard

**Features:**
- Inline editing without leaving presentation mode
- Add/remove bullet points dynamically
- Multi-line support for longer bullet points
- Empty bullets are automatically filtered out on save

**Persistence:**
- Content edits saved to localStorage
- Saved per language in key: `slideContent_{language}`
- Changes persist across sessions and page reloads

**Limitations:**
- Only works on non-title slides (content slides with bullets)
- Title slides cannot be edited through the UI

---

### 4. 🔄 Reset Functionality

**Location:** Fixed button in top-left area (below theme toggle)

**What it does:**
- Restores original slide order from JSON files
- Restores all deleted slides
- Resets all content edits to original
- Resets current slide to first slide

**How to use:**
1. Click the "🔄 Reset Slides" button
2. Confirm in the dialog
3. All customizations are cleared for the current language

**Storage cleared:**
- `slideOrder_{language}` - Order and deletions
- `slideContent_{language}` - Content edits

---

## Technical Implementation

### Data Storage

All customizations use browser `localStorage` with language-specific keys:

```javascript
// Slide order and deletions
slideOrder_en = {
  order: ["seg-1", "seg-2", "seg-3", ...],
  deletedIds: ["seg-5", "seg-7"]
}

// Content edits
slideContent_en = {
  "seg-2": {
    bullets: ["Updated bullet 1", "Updated bullet 2", ...]
  },
  "seg-3": {
    bullets: ["Modified content", ...]
  }
}
```

### Component Architecture

**New Components:**
- `EditableBullets.tsx` - Handles bullet point editing UI

**Modified Components:**
- `ProgressBar.tsx` - Added delete buttons and hover states
- `SlideDeck.tsx` - Added persistence logic and handlers
- `Slide.tsx` - Integrated EditableBullets component

**Key Functions:**
- `handleReorder()` - Reorders slides and saves to localStorage
- `handleDelete()` - Removes slide and updates storage
- `handleUpdateBullets()` - Saves content edits to localStorage
- `handleReset()` - Clears all customizations
- `saveToStorage()` - Persists slide order and deletions

### Loading Sequence

When the app loads or language changes:
1. Load original segments from JSON
2. Apply content edits from `slideContent_{language}`
3. Filter out deleted slides from `slideOrder_{language}`
4. Reorder segments based on saved order
5. Render the customized presentation

---

## Use Cases

### 📊 Adaptive Presentations
- Reorder slides based on audience questions
- Skip irrelevant content by deleting slides
- Customize bullet points for specific audiences

### 🎯 Multiple Audiences
- Create different versions for different contexts
- Each language can have independent customizations
- Quick reset to start fresh

### 🔄 Iterative Refinement
- Edit content based on feedback
- Test different slide orders
- Refine messaging over time

---

## Keyboard Shortcuts

Existing shortcuts still work:
- `←→` - Navigate slides
- `P` - Toggle presenter notes
- `T` - Toggle theme
- `Home` - Go to first slide
- `End` - Go to last slide

---

## Browser Compatibility

**Requirements:**
- Modern browser with localStorage support
- HTML5 Drag and Drop API support
- JavaScript enabled

**Tested on:**
- Chrome/Edge (Chromium)
- Firefox
- Safari

---

## Data Persistence

**What persists:**
- ✅ Slide order (localStorage)
- ✅ Deleted slides (localStorage)
- ✅ Content edits (localStorage)
- ✅ Current slide position (sessionStorage)

**What doesn't persist:**
- ❌ Theme preference (resets on reload)
- ❌ Presenter notes visibility (resets on reload)
- ❌ Media player state (resets on slide change)

---

## Tips & Best Practices

💡 **Pro Tips:**
- Use different customizations for different languages
- Test your customized presentation before going live
- Keep a backup of important content edits (localStorage can be cleared)
- Use the Reset button to start fresh for a new audience

⚠️ **Warnings:**
- Clearing browser data will erase all customizations
- Private/Incognito mode may not persist data
- Changes are local to your browser only

---

## Future Enhancements

Potential features for future versions:
- Export/import customizations as JSON
- Edit titles and subtitles
- Duplicate slides
- Undo/redo functionality
- Cloud sync for customizations
- Slide templates
- Bulk operations

---

## Troubleshooting

**Customizations not saving?**
- Check if localStorage is enabled in your browser
- Verify you're not in private/incognito mode
- Check browser console for errors

**Can't delete a slide?**
- You cannot delete the last remaining slide
- Hover properly over the slide number to see the delete button

**Edit button not showing?**
- Edit button only appears on content slides with bullets
- Title slides cannot be edited through the UI

**Changes lost after reload?**
- Check if browser is clearing localStorage on exit
- Verify localStorage quota hasn't been exceeded
- Check for browser extensions that clear storage

---

## Summary

You now have full control over your presentation structure and content:
1. **Reorder** slides by dragging in the progress bar
2. **Delete** slides with the hover "×" button
3. **Edit** bullet points with the "✏️ Edit" button
4. **Reset** everything with the "🔄 Reset Slides" button

All changes are automatically saved and persist across sessions, giving you the flexibility to adapt your presentation on the fly while maintaining your customizations.
