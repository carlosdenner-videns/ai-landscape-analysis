# AI Landscape Analysis - Interactive Lecture Deck

A beautiful, responsive, multilingual (EN/ES/PT) web application that presents lectures as interactive slide decks. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## ✨ Features

- **Multilingual Support**: Switch between English, Spanish, and Portuguese
- **Rich Media**: Images, local videos, YouTube embeds, and custom HTML
- **Keyboard Navigation**: Arrow keys, Home/End, and shortcuts
- **Presenter Mode**: Press `P` to toggle speaker notes
- **Dark/Light Theme**: Press `T` to toggle theme
- **Progress Tracking**: Visual progress bar with clickable navigation
- **Citation Management**: Collapsible drawer for sources and references
- **Accessibility**: WCAG AA compliant with semantic HTML and ARIA labels
- **Responsive Design**: Optimized for projectors (1280×720, 1920×1080)
- **Performance**: Lazy loading, code splitting, and media preloading

## 📁 Project Structure

```
slide-app/
├── public/
│   └── assets/
│       ├── images/          # Image files
│       ├── videos/          # Local video files
│       └── ASSETS_README.md # Asset documentation
├── src/
│   ├── components/
│   │   ├── CitationDrawer.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── MediaPlayer.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Slide.tsx
│   │   └── SlideDeck.tsx
│   ├── content/
│   │   ├── content-en.json  # English content
│   │   ├── content-es.json  # Spanish content
│   │   └── content-pt.json  # Portuguese content
│   ├── hooks/
│   │   ├── useLanguage.ts
│   │   └── useTheme.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 📝 Content Management

### Content Schema

Each language has its own JSON file in `src/content/`:

```typescript
{
  "meta": {
    "author": "Your Name",
    "version": "1.0.0"
  },
  "segments": [
    {
      "id": "seg-1",
      "title": "Slide Title",
      "subtitle": "Optional subtitle",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "media": [
        {
          "type": "image",
          "src": "/assets/images/example.png",
          "alt": "Description",
          "caption": "Optional caption"
        }
      ],
      "engagement": {
        "prompt": "Discussion question"
      },
      "citations": [
        {
          "label": "Source Title - Publisher",
          "url": "https://example.com"
        }
      ],
      "notes": "Speaker notes (visible in presenter mode)"
    }
  ]
}
```

### Media Types

**Image:**
```json
{
  "type": "image",
  "src": "/assets/images/filename.png",
  "alt": "Accessibility description",
  "caption": "Optional caption"
}
```

**Local Video:**
```json
{
  "type": "videoLocal",
  "src": "/assets/videos/filename.mp4",
  "poster": "/assets/images/thumbnail.jpg",
  "caption": "Optional caption"
}
```

**YouTube Video:**
```json
{
  "type": "videoYouTube",
  "id": "dQw4w9WgXcQ",
  "caption": "Optional caption"
}
```

**Custom HTML Embed:**
```json
{
  "type": "embed",
  "html": "<div>Custom HTML content</div>",
  "caption": "Optional caption"
}
```

## 🌍 Adding/Updating Translations

1. Open the appropriate content file:
   - `src/content/content-en.json` (English)
   - `src/content/content-es.json` (Spanish)
   - `src/content/content-pt.json` (Portuguese)

2. Maintain the same structure across all languages

3. Update the text fields:
   - `title`, `subtitle`, `bullets`
   - `engagement.prompt`
   - `citations[].label`
   - `notes`

4. Keep `id`, `src`, `url`, and other technical fields identical

## 🎨 Adding Media Assets

### Images
1. Place image files in `public/assets/images/`
2. Reference in content JSON: `"/assets/images/yourfile.png"`
3. Always provide `alt` text for accessibility

### Videos
1. Place video files in `public/assets/videos/`
2. Reference in content JSON: `"/assets/videos/yourfile.mp4"`
3. Optional: Add a poster image for thumbnails

### Optimization Tips
- Compress images before adding (use TinyPNG, ImageOptim)
- Keep images under 2MB
- Use MP4 format with H.264 codec for videos
- Consider YouTube embedding for large videos

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` or `↓` | Next slide |
| `←` or `↑` | Previous slide |
| `Space` | Next slide |
| `Home` | First slide |
| `End` | Last slide |
| `P` | Toggle presenter notes |
| `T` | Toggle dark/light theme |
| `Esc` | Close citation drawer |

## 🎯 Presentation Tips

1. **Full Screen Mode**: Press `F11` in your browser
2. **Presenter Display**: Use `P` to show/hide speaker notes
3. **Navigation**: Use arrow keys or on-screen buttons
4. **Citations**: Click "View Sources" to show references
5. **Language Switch**: Use the language toggle (top-right)
6. **Theme**: Adjust for room lighting with `T`

## 🧪 Development

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format
```

### TypeScript

All components are strictly typed. Type definitions are in `src/types/index.ts`.

### Adding New Components

1. Create component in `src/components/`
2. Import and use TypeScript types from `src/types/`
3. Follow existing component patterns
4. Add JSDoc comments for props

## 🏗️ Building for Production

```bash
# Create optimized production build
npm run build

# Output will be in the `dist/` directory
```

Deploy the `dist/` folder to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## ♿ Accessibility

- **Semantic HTML**: Proper landmark elements (`<main>`, `<nav>`, `<article>`)
- **ARIA Labels**: All interactive elements labeled
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Screen Readers**: Tested with NVDA and VoiceOver
- **Reduced Motion**: Respects `prefers-reduced-motion`

## 🔧 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color palette:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color scale
      },
    },
  },
}
```

### Typography

Adjust font sizes and line heights in `tailwind.config.js`:

```js
theme: {
  extend: {
    lineHeight: {
      'projector': '1.8', // Adjust for readability
    },
  },
}
```

### Animations

Modify animations in `src/index.css`:

```css
@keyframes fadeIn {
  /* Custom animation */
}
```

## 📋 Content Checklist

Before presenting:

- [ ] All images are added to `/public/assets/images/`
- [ ] All videos are added or YouTube IDs are correct
- [ ] Alt text provided for all images
- [ ] Citations include working URLs
- [ ] Speaker notes added for each segment
- [ ] Content translated to all required languages
- [ ] Test on target projector/screen resolution
- [ ] Verify dark mode if presenting in dark room

## 🐛 Troubleshooting

**Images not loading:**
- Verify file path starts with `/assets/`
- Check file exists in `public/` directory
- Ensure file extension matches (case-sensitive on Linux)

**Videos not playing:**
- Use MP4 format with H.264 codec
- Check file size (< 50MB recommended)
- Test in different browsers

**Language not switching:**
- Clear browser localStorage
- Check JSON syntax in content files
- Verify all three language files exist

**Build errors:**
- Run `npm install` to ensure dependencies are updated
- Check TypeScript errors with `npm run build`
- Verify JSON files are valid

## 📄 License

This project is provided as-is for educational and presentation purposes.

## 🤝 Contributing

To add features or fix bugs:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📧 Support

For questions or issues:
- Check the troubleshooting section
- Review the content schema documentation
- Consult TypeScript types for component APIs

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
