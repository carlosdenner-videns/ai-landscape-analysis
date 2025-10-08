# Assets Directory

This directory contains media assets for the presentation slides.

## Expected Files

### Images (in `/assets/images/`)
- `wordcloud.png` - AI research word cloud
- `policy_timeline.png` - Global AI policy timeline
- `health_ai_retina.png` - AI analyzing retinal scans
- `av_waymo_city.jpg` - Autonomous vehicle in city
- `fairness_face_error_chart.png` - Facial recognition error rates chart
- `global_local_snapshot.png` - Global-local AI dynamics visualization

### Videos (in `/assets/videos/`)
- `intro.mp4` - Project introduction video

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
