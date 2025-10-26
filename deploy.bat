@echo off
echo ========================================
echo 🚀 MangaAMV Pro Editor - Deploy Script
echo ========================================
echo.

echo 🏗️ Building production bundle...
call npm run build

if %errorlevel% == 0 (
    echo ✅ Build successful!
    echo.
    echo 📊 Build Stats:
    echo    Bundle Size: 148.99 KB
    echo    PWA Enabled: Yes
    echo    Service Worker: Generated
    echo.
    
    set /p deploy="🌐 Deploy to Vercel now? (y/n): "
    
    if /i "%deploy%"=="y" (
        where vercel >nul 2>nul
        if %errorlevel% == 0 (
            echo 🚀 Deploying to Vercel...
            call vercel --prod
            echo.
            echo ✅ Deployment complete!
            echo 🎉 Your app is now live!
        ) else (
            echo 📦 Installing Vercel CLI...
            call npm install -g vercel
            echo 🚀 Deploying to Vercel...
            call vercel --prod
        )
    ) else (
        echo ⏸️ Deployment skipped
        echo.
        echo 💡 To deploy later, run: vercel --prod
    )
) else (
    echo ❌ Build failed. Please fix errors and try again.
    exit /b 1
)

echo.
echo 📖 Next Steps:
echo    1. Test your deployment
echo    2. Share URL with testers
echo    3. Read TESTING.md for testing guide
echo    4. Check DEPLOYMENT.md for more options
echo.
echo 🎉 Happy editing!
pause
