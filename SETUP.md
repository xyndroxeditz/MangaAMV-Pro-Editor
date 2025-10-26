# 🎯 SETUP GUIDE - MangaAMV Pro Editor

## Complete Installation Instructions

### Prerequisites Check

Before starting, ensure you have:

- ✅ **Node.js 16+**: Download from [nodejs.org](https://nodejs.org)
- ✅ **Git**: Download from [git-scm.com](https://git-scm.com)
- ✅ **Code Editor**: VS Code recommended
- ✅ **Mobile Device** OR **Emulator**

---

## 🪟 Windows Setup

### 1. Install Node.js & npm

```powershell
# Verify installation
node --version  # Should show v16.x.x or higher
npm --version   # Should show 8.x.x or higher
```

### 2. Install Expo CLI

```powershell
npm install -g expo-cli
```

### 3. Navigate to Project

```powershell
cd "d:\MANGA EDITOR APP"
```

### 4. Install Dependencies

```powershell
# This will take 2-5 minutes
npm install

# If you encounter errors, try:
npm install --legacy-peer-deps
```

### 5. Start Development Server

```powershell
npm start
```

You should see:
```
Metro waiting on exp://192.168.x.x:19000
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

### 6. Run on Your Phone

**Option A: Physical Device**
1. Install **Expo Go** app from:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [Apple App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)
2. Open Expo Go app
3. Scan the QR code shown in terminal
4. App will load on your phone!

**Option B: Android Emulator**
1. Install [Android Studio](https://developer.android.com/studio)
2. Create Android Virtual Device (AVD)
3. Start emulator
4. In terminal, press **`a`**

**Option C: iOS Simulator (Mac only)**
1. Install Xcode from App Store
2. Install Command Line Tools
3. In terminal, press **`i`**

---

## 🍎 macOS Setup

### 1. Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js

```bash
brew install node
```

### 3. Install Expo CLI

```bash
npm install -g expo-cli
```

### 4. Navigate & Install

```bash
cd ~/Documents/MANGA\ EDITOR\ APP
npm install
npm start
```

---

## 🐧 Linux Setup

### 1. Install Node.js (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install Dependencies & Run

```bash
npm install -g expo-cli
cd /path/to/MANGA\ EDITOR\ APP
npm install
npm start
```

---

## 📦 Package Installation Details

The `npm install` command installs all required packages:

| Package | Purpose |
|---------|---------|
| **react-native** | Mobile framework |
| **expo** | Development tools |
| **zustand** | State management |
| **@react-navigation** | Navigation system |
| **three** | 3D rendering |
| **expo-av** | Audio/video handling |
| **fast-xml-parser** | XML import/export |
| And 20+ more... | See package.json |

Total install size: ~500MB  
Installation time: 2-5 minutes

---

## 🔧 Configuration

### Environment Setup (Optional)

Create `.env` file in root directory:

```env
# API Keys (if needed for cloud features)
EXPO_PUBLIC_API_KEY=your_api_key_here

# Feature Flags
ENABLE_AI_UPSCALE=true
ENABLE_CLOUD_SYNC=false
```

### Expo Configuration

The `app.json` file is pre-configured with:
- App name: "MangaAMV Pro"
- Bundle ID: com.mangaamv.proeditor
- Permissions: Camera, Storage, Audio
- Dark mode enabled
- Hot pink theme (#FF2D95)

---

## 🏗 Building for Production

### Android APK

```bash
# Configure EAS (first time only)
npm install -g eas-cli
eas login
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### iOS IPA (Mac only)

```bash
# Requires Apple Developer account
eas build --platform ios --profile preview
```

### Release Build

```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

---

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

### Run Linter

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Issue: Metro bundler port already in use

**Solution:**
```bash
# Kill process on port 8081 (Windows)
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Kill process (Mac/Linux)
lsof -ti:8081 | xargs kill -9
```

### Issue: Expo Go not connecting

**Solution:**
1. Ensure phone and computer on same WiFi
2. Disable VPN/firewall temporarily
3. Use tunnel mode: `expo start --tunnel`

### Issue: Build fails with memory error

**Solution:**
```bash
# Increase Node memory limit
export NODE_OPTIONS=--max_old_space_size=4096
npm start
```

### Issue: TypeScript errors

**Solution:**
```bash
# These are expected during initial setup
# Install packages first, errors will resolve
npm install
```

---

## 📱 Device Requirements

### Minimum Requirements
- **Android**: 6.0+ (API 23+)
- **iOS**: 12.0+
- **RAM**: 2GB minimum
- **Storage**: 500MB free space

### Recommended Requirements
- **Android**: 10.0+ (API 29+)
- **iOS**: 14.0+
- **RAM**: 4GB+
- **Storage**: 2GB free space
- **GPU**: OpenGL ES 3.0 support

---

## 🎨 Project Structure Verification

After installation, verify these folders exist:

```
✅ d:\MANGA EDITOR APP\
  ✅ node_modules/        (500MB+)
  ✅ src/
    ✅ components/
    ✅ screens/
    ✅ navigation/
    ✅ store/
    ✅ types/
    ✅ constants/
    ✅ effects/
    ✅ utils/
  ✅ App.tsx
  ✅ package.json
  ✅ tsconfig.json
  ✅ README.md
```

---

## 🚀 Next Steps

After successful setup:

1. ✨ **Explore the App**
   - Open Home screen
   - Browse effect library
   - Create test project

2. 📚 **Read Documentation**
   - `README.md` - Full documentation
   - `QUICKSTART.md` - Quick tutorial
   - Code comments - Implementation details

3. 🎬 **Try Example**
   - Import sample project
   - Apply effects
   - Test export

4. 🛠 **Customize**
   - Modify colors in `src/constants/theme.ts`
   - Add effects in `src/effects/effectsLibrary.ts`
   - Extend features in respective files

---

## 📞 Support

**Still having issues?**

- 📧 Email: support@mangaamv.pro
- 💬 Discord: [discord.gg/mangaamv](https://discord.gg/mangaamv)
- 🐛 GitHub Issues: Report bugs
- 📖 Documentation: Full guides

---

## ✅ Setup Checklist

- [ ] Node.js installed (v16+)
- [ ] Project cloned/downloaded
- [ ] Dependencies installed (`npm install`)
- [ ] Development server started (`npm start`)
- [ ] Expo Go app installed on phone
- [ ] App running on device
- [ ] README.md read
- [ ] First test project created

---

**🎉 Congratulations! You're ready to create amazing AMVs!**

*The #1 app for AMV & Manga editing is now in your hands.*
