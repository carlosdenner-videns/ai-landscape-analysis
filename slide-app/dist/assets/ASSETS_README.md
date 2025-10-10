# Assets Directory

This directory contains media assets for the presentation slides.

## Expected Files

### Images (in `/assets/images/`)
**Required for Colombia Presentation:**
- `wordcloud.png` - Word cloud from 710,000 words of EU AI research (Slide 1)
- `top_words.png` - Bar chart showing top 5 terms with mention counts (Slide 2)
- `topic_distribution.png` - Five pillars of AI policy with star ratings (Slide 3)
- `document_lengths.png` - Research depth visualization (Slide 4)
- `global_local_snapshot.png` - Gap analysis between EU research and LATAM realities (Slide 5)

### Videos (in `/assets/videos/`)
- `intro.mp4` - Project introduction video

**Note:** These images should be generated from your analysis output in the `landscape_analysis_output` folder.

## Adding New Assets

1. **Images**: Place image files in `/public/assets/images/`
2. **Videos**: Place video files in `/public/assets/videos/`
3. **Update Content**: Reference the asset path in your content JSON files

## Supported Formats

- **Images**: PNG, JPG, JPEG, GIF, SVG, WEBP
- **Videos**: MP4, WEBM, OGG

## File Size Recommendations

- **Images**: < 2MB for optimal loading
- **Videos**: < 50MB, consider external hosting for larger files
- Use image compression tools (e.g., TinyPNG, ImageOptim)
- For large videos, consider YouTube embedding instead

## Path Format

When referencing assets in content JSON:
```json
{
  "type": "image",
  "src": "/assets/images/your-file.png",
  "alt": "Description for accessibility",
  "caption": "Optional caption"
}
```
