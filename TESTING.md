# 🧪 Testing Guide for MangaAMV Pro Editor

Welcome testers! Help us make this the best video editor. 🎬

---

## 📱 How to Access

### On Your Phone/Tablet
1. Make sure you're on the same WiFi as the host
2. Open your browser (Chrome/Safari recommended)
3. Visit: **http://192.168.100.72:4173**
4. Bookmark it for easy access!

### On Your Computer
- Visit: **http://localhost:4173**

### Public URL (Coming Soon)
Once deployed, you'll get a link like: `https://mangaamv-pro.vercel.app`

---

## ✅ What to Test

### 1. Video Upload (5 min)
- [ ] Drag and drop a video file
- [ ] Click to browse and select video
- [ ] Try multiple videos at once
- [ ] Check if thumbnails generate
- [ ] Test different formats (MP4, WebM, MOV)

**Expected:** Videos appear on timeline with thumbnails

---

### 2. Timeline Editing (10 min)
- [ ] Drag clips to reorder them
- [ ] Click on a clip to select it
- [ ] Use zoom controls (+/-)
- [ ] Scroll timeline left/right
- [ ] Select different clips

**Expected:** Smooth drag & drop, visual feedback

---

### 3. Trimming & Splitting (10 min)
- [ ] Select a clip
- [ ] Go to "Trim" tab
- [ ] Adjust start time slider
- [ ] Adjust end time slider
- [ ] Click "Split at Current Time"
- [ ] Check if split creates two clips

**Expected:** Precise trimming, accurate split

---

### 4. Visual Effects (10 min)
- [ ] Select a clip
- [ ] Go to "Effects" tab
- [ ] Adjust brightness slider
- [ ] Adjust contrast slider
- [ ] Adjust saturation slider
- [ ] Try hue rotation
- [ ] Apply blur effect
- [ ] Use preset filters (Warm, Cool, Vibrant)
- [ ] Try transitions (Fade, Dissolve, etc.)

**Expected:** Real-time preview of effects

---

### 5. Text Overlays (10 min)
- [ ] Go to "Text" tab
- [ ] Type some text
- [ ] Change font
- [ ] Adjust size slider
- [ ] Change color
- [ ] Toggle bold/italic
- [ ] Enable outline
- [ ] Change outline color
- [ ] Click "Add Text to Timeline"
- [ ] Check text appears on video

**Expected:** Text renders on video preview

---

### 6. Audio Tracks (10 min)
- [ ] Go to "Audio" tab
- [ ] Click "Add Audio Track"
- [ ] Upload an MP3/audio file
- [ ] Adjust volume slider
- [ ] Change start time
- [ ] Adjust fade in
- [ ] Adjust fade out
- [ ] Try audio effects
- [ ] Add multiple audio tracks

**Expected:** Audio syncs with video

---

### 7. Export (15 min)
- [ ] Go to "Export" tab
- [ ] Check project stats
- [ ] Select 720p quality
- [ ] Choose MP4 format
- [ ] Adjust frame rate
- [ ] Click "Export Video"
- [ ] Wait for progress bar
- [ ] Download exported video
- [ ] Play the exported video

**Expected:** Video exports successfully

---

### 8. Playback Controls (5 min)
- [ ] Click play button
- [ ] Video plays smoothly
- [ ] Click pause
- [ ] Use timeline slider to seek
- [ ] Adjust volume
- [ ] Check time display

**Expected:** Smooth playback, responsive controls

---

### 9. Mobile Experience (10 min)
**On phone/tablet only:**
- [ ] Touch controls work
- [ ] Pinch to zoom timeline
- [ ] Swipe to scroll
- [ ] Buttons easy to tap
- [ ] Text readable
- [ ] No lag or freezing
- [ ] Screen rotates properly

**Expected:** Fully functional on mobile

---

### 10. Performance Testing (10 min)
- [ ] Upload 5+ videos
- [ ] Add multiple text overlays
- [ ] Add 2+ audio tracks
- [ ] Apply effects to all clips
- [ ] Try playing the timeline
- [ ] Check if it's smooth
- [ ] Export a complex project

**Expected:** No crashes, acceptable speed

---

## 🐛 Report Bugs

When you find a bug, please note:

1. **What happened?** (describe the issue)
2. **What did you expect?** (expected behavior)
3. **Steps to reproduce:**
   - Step 1
   - Step 2
   - Step 3
4. **Device:** (iPhone 14, Galaxy S23, Windows PC, etc.)
5. **Browser:** (Chrome 120, Safari 17, etc.)
6. **Screenshot:** (if possible)

---

## 💡 Feature Suggestions

We want your ideas! Suggest:
- New effects or filters
- Different export formats
- UI improvements
- Workflow enhancements
- Anything that would make editing easier!

---

## ⭐ What We're Looking For

### Critical Issues
- App crashes
- Videos don't upload
- Can't export videos
- Timeline doesn't work
- Effects don't apply

### Important Issues
- Slow performance
- UI bugs
- Confusing features
- Missing features
- Mobile issues

### Nice to Have
- Small visual glitches
- Feature improvements
- UI polish
- Performance optimization

---

## 🎯 Test Scenarios

### Scenario 1: Simple AMV
1. Upload 3 anime clips
2. Trim each to 10 seconds
3. Add fade transitions between them
4. Add title text at start
5. Add music track
6. Export as 1080p MP4

**Time:** ~10 minutes

---

### Scenario 2: Manga Edit
1. Upload 5 manga panel images
2. Arrange in timeline
3. Add text captions
4. Apply zoom effects
5. Add dramatic music
6. Export as 720p MP4

**Time:** ~15 minutes

---

### Scenario 3: Multi-Layer Project
1. Upload main video
2. Add 2 more video overlays
3. Add 3 text overlays
4. Add 2 audio tracks
5. Apply filters to each layer
6. Export as 4K

**Time:** ~20 minutes

---

## 📊 Feedback Form

After testing, please answer:

### Usability (1-10)
- How easy was it to use? ___
- Did you understand all features? ___
- Was the UI intuitive? ___

### Performance (1-10)
- How smooth was the app? ___
- Upload speed? ___
- Export speed? ___

### Features (1-10)
- Are there enough effects? ___
- Is export quality good? ___
- Do you need more features? ___

### Overall (1-10)
- Would you use this app? ___
- Would you recommend it? ___
- Overall rating? ___

---

## 🏆 Testing Milestones

- [ ] **Basic Test** - Upload, edit, export one video
- [ ] **Advanced Test** - Use all features
- [ ] **Stress Test** - 10+ videos, complex project
- [ ] **Mobile Test** - Full workflow on phone
- [ ] **Real Project** - Create actual AMV/edit

---

## 🎉 Thank You!

Your testing helps make MangaAMV Pro the best it can be!

**Questions?** Ask the developer
**Found bugs?** Report them
**Love it?** Tell your friends!

---

**Happy Testing!** 🚀🎬✨
