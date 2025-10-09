# Live Captions Feature 🎤

## Overview

The Live Captions feature provides real-time speech transcription and translation for your presentations. It uses the **Web Speech API** (browser-native) to capture your speech through your **Shure MV6 microphone** and displays both the original English transcript and a Spanish translation in a discrete footer bar.

## Features

✅ **Real-time transcription** - Converts your speech to text as you speak  
✅ **Auto-translation** - Translates English to Spanish (or Portuguese/French)  
✅ **Discrete footer display** - Shows captions without obstructing slides  
✅ **Toggle on/off** - Easy start/stop button  
✅ **No API keys required** - Uses browser's native speech recognition  
✅ **Works with any microphone** - Including your Shure MV6

## How to Use

### 1. Browser Requirements

**✅ Recommended:**
- Google Chrome (latest version)
- Microsoft Edge (latest version)

**❌ Not Supported:**
- Firefox (limited support)
- Safari (not supported)

### 2. During Your Presentation

1. **Open your presentation** in Chrome or Edge
2. Look for the **caption bar at the bottom** of the screen
3. Click **"Start Live Captions"** button
4. **Grant microphone permission** when prompted
5. Start speaking! Captions will appear in real-time
6. Click **"Stop Captions"** when done

### 3. Microphone Setup

Your **Shure MV6** should work automatically:

1. Connect the MV6 to your computer via USB
2. Make sure it's selected as the default microphone in Windows
3. Test the mic in Windows settings before your presentation
4. Ensure the gain is set appropriately (not too low or too high)

### 4. Testing Before Demo

**IMPORTANT:** Test this feature **at least 2 days before** your presentation!

#### Pre-Demo Checklist:

- [ ] Test in the **actual browser** you'll use (Chrome/Edge)
- [ ] Test with your **Shure MV6** connected
- [ ] Check **microphone permissions** are granted
- [ ] Verify **internet connection** (needed for translation)
- [ ] Test in a **quiet environment** first
- [ ] Practice with **background noise** similar to venue
- [ ] Test **accuracy** with your speaking style/accent
- [ ] Verify **translation quality** is acceptable
- [ ] Have a **backup plan** if it doesn't work

#### Testing Steps:

```bash
# 1. Start your dev server
npm run dev

# 2. Open in Chrome/Edge (not Firefox!)
# 3. Click "Start Live Captions"
# 4. Grant microphone permission
# 5. Speak a few test sentences
# 6. Verify both English and Spanish appear correctly
```

## Technical Details

### Architecture

```
User Speech (Shure MV6)
    ↓
Web Speech API (Browser)
    ↓
English Transcript
    ↓
MyMemory Translation API
    ↓
Spanish Translation
    ↓
Display in Footer Bar
```

### Components Created

1. **`useSpeechRecognition.ts`** - Custom hook for Web Speech API
2. **`LiveCaptionBar.tsx`** - UI component for captions
3. **`translation.ts`** - Translation utilities using MyMemory API

### Translation API

- **Service:** MyMemory Translation API (free, no API key)
- **Limits:** ~1000 chars/request
- **Latency:** ~500ms-2s
- **Requires:** Internet connection

## Demo Risk Assessment

### Risk Level: **MEDIUM** ⚠️

**What Could Go Wrong:**

1. **Microphone permission issues** - Browser blocks mic access
   - **Mitigation:** Test beforehand, use HTTPS
   
2. **Internet connectivity** - Translation requires network
   - **Mitigation:** Test venue WiFi, have mobile hotspot backup
   
3. **Transcription accuracy** - May misunderstand words/accent
   - **Mitigation:** Speak clearly, test with your voice beforehand
   
4. **Browser compatibility** - Audience using Firefox/Safari
   - **Mitigation:** Instruct audience to use Chrome/Edge
   
5. **Background noise** - Conference venue may be noisy
   - **Mitigation:** Use directional mic (Shure MV6 is good), test in similar conditions

**Failure Modes:**

- **Worst case:** Feature doesn't work → Presentation continues normally without captions
- **Degraded:** Transcription works but translation fails → English captions still visible
- **Best case:** Everything works perfectly, audience is impressed! 🎉

## Troubleshooting

### "Microphone access denied"
- Check browser permissions
- Reload page and grant permission
- Ensure HTTPS (required for mic access)

### "Speech recognition not supported"
- Switch to Chrome or Edge browser
- Update browser to latest version

### "Transcription not appearing"
- Check if microphone is active (green indicator)
- Speak louder or closer to mic
- Check mic gain settings

### "Translation not showing"
- Check internet connection
- Wait a few seconds (translation is debounced)
- Check browser console for errors

### "Captions are inaccurate"
- Speak more clearly
- Reduce background noise
- Speak at moderate pace (not too fast)
- Use standard pronunciation

## Customization

To change the target language, edit `App.tsx`:

```typescript
<LiveCaptionBar 
  targetLanguage="es"  // Change to 'pt' or 'fr'
  sourceLanguage="en-US"
  showOriginal={true}  // Set to false to hide English
/>
```

## Performance Tips

1. **Stable Internet:** Translation requires network, ensure good WiFi
2. **Close Other Apps:** Free up system resources
3. **Quiet Environment:** Better transcription accuracy
4. **Clear Speech:** Speak at normal pace, not too fast
5. **Test First:** ALWAYS test before the actual demo

## Backup Plan

If the feature doesn't work during demo:

1. **Stay calm** - Don't let it disrupt your presentation
2. **Disable it** - Click "Stop Captions" and continue
3. **Acknowledge** - "Let me turn off this experimental feature for now"
4. **Continue** - Your slides and content are still excellent!

## Support

For issues or questions, check:
- Browser console (F12) for error messages
- Microphone settings in Windows
- Network connectivity

---

**Good luck with your presentation! 🚀**
