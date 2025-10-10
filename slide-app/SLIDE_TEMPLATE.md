# Slide Template System

## Overview
The presentation now uses a **template-based architecture** for consistent layout and easier maintenance.

## Components

### 1. **TitleSlide** (`TitleSlide.tsx`)
- Used for the first slide only
- Custom layout with branding, presenter info, and key dimensions
- Identified by `isTitle: true` in the content JSON

### 2. **ContentSlide** (`ContentSlide.tsx`)
- **Reusable template** for all content slides (slides 2+)
- Provides consistent two-column layout with balanced proportions
- Accepts content as props for maximum flexibility

### 3. **Slide** (`Slide.tsx`)
- **Orchestrator component** that:
  - Routes to `TitleSlide` or `ContentSlide` based on slide type
  - Prepares content sections (left, right, bottom)
  - Handles media navigation and speaker notes

## Layout Structure

### ContentSlide Template
```
┌─────────────────────────────────────────────────┐
│ Header (Title + Subtitle)                      │
├──────────────────┬──────────────────────────────┤
│ Left Column      │ Right Column                 │
│ (45% width)      │ (55% width)                  │
│                  │                              │
│ • Bullets        │ • Media/Charts               │
│ • Text content   │ • Visualizations             │
│                  │                              │
├──────────────────┴──────────────────────────────┤
│ Bottom Section (Engagement/Citations)          │
└─────────────────────────────────────────────────┘
```

### Key Features
- **45/55 split**: Better visual balance between text and media
- **Vertical alignment**: Content starts at top for cleaner look
- **Compact header**: More space for main content
- **Flexible bottom**: Optional engagement prompts or citations

## Benefits

### ✅ Consistency
All content slides follow the same layout pattern

### ✅ Maintainability
Layout changes only need to be made in `ContentSlide.tsx`

### ✅ Flexibility
Content is passed as React nodes, allowing any structure

### ✅ Scalability
Easy to add new slide types or modify existing ones

## Usage Example

```tsx
<ContentSlide
  title="Slide Title"
  subtitle="Optional subtitle"
  leftContent={<BulletList items={bullets} />}
  rightContent={<MediaPlayer media={image} />}
  bottomContent={<EngagementPrompt text="..." />}
/>
```

## Future Enhancements

- Add more template variants (e.g., full-width, three-column)
- Support for different media types in right column
- Customizable column ratios via props
- Animation presets for content reveal
