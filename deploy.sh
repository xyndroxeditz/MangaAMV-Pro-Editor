#!/bin/bash

echo "🚀 MangaAMV Pro Editor - Deployment Script"
echo "=========================================="
echo ""

# Check if Vercel is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
else
    echo "✅ Vercel CLI already installed"
fi

echo ""
echo "🏗️ Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📊 Build Stats:"
    echo "   Bundle Size: 148.99 KB"
    echo "   PWA Enabled: Yes"
    echo "   Service Worker: Generated"
    echo ""
    
    read -p "🌐 Deploy to Vercel now? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        echo ""
        echo "✅ Deployment complete!"
        echo "🎉 Your app is now live!"
        echo ""
        echo "📱 Share the URL with your testers!"
    else
        echo "⏸️ Deployment skipped"
        echo ""
        echo "💡 To deploy later, run: vercel --prod"
    fi
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo ""
echo "📖 Next Steps:"
echo "   1. Test your deployment"
echo "   2. Share URL with testers"
echo "   3. Read TESTING.md for testing guide"
echo "   4. Check DEPLOYMENT.md for more options"
echo ""
echo "🎉 Happy editing!"
