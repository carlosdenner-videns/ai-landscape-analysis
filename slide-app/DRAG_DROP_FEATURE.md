# Drag-and-Drop Slide Reordering

## Overview
The progress bar now supports **drag-and-drop** functionality to reorder slides during your presentation.

## How to Use

### Reordering Slides
1. **Hover** over any slide number in the progress bar
2. **Click and hold** to start dragging
3. **Drag** to the desired position
4. **Release** to drop the slide in the new position

### Visual Feedback
- **Dragging**: The dragged slide becomes semi-transparent (50% opacity)
- **Drop target**: The target position shows a yellow ring highlight
- **Cursor**: Changes to a move cursor when hovering over slides

### Navigation
- **Click** any slide number to jump to that slide (works as before)
- **Drag** to reorder slides without navigating

## Features

### Smart Index Tracking
The system automatically adjusts the current slide index when reordering:
- If you move the current slide, it follows to the new position
- If you move slides around the current slide, the index adjusts accordingly

### Session Persistence
- Slide order changes are **temporary** (session-only)
- Reloading the page resets to the original order
- Perfect for dynamic presentations where you want to adapt on the fly

### Language Support
- Reordering works across all languages
- Changing language resets to the original order

## Use Cases

### 📊 Adaptive Presentations
Reorder slides based on:
- Audience questions
- Time constraints
- Discussion flow
- Emerging topics

### 🎯 Focus Areas
- Move key slides forward
- Skip less relevant content
- Group related topics together

### 🔄 Interactive Sessions
- Respond to audience interests
- Adjust flow based on engagement
- Create custom narrative paths

## Technical Details

### Implementation
- **HTML5 Drag and Drop API**: Native browser support
- **React State Management**: Maintains slide order in component state
- **Index Adjustment**: Automatically tracks current position

### Accessibility
- Keyboard navigation still works (arrow keys, Home, End)
- Screen readers announce slide numbers
- Focus management preserved

## Limitations

- Changes are **not persisted** to disk
- Original order restored on page reload
- Cannot reorder across different language versions

## Tips

💡 **Pro tip**: Use this feature to create different presentation paths for different audiences without maintaining multiple slide decks!

⚠️ **Note**: If you want to permanently change the slide order, edit the content JSON files directly.
