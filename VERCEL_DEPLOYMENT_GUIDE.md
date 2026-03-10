# 🚀 Vercel Deployment Guide for Gyan Setu

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup
In your Vercel dashboard, add these environment variables:

**Required Variables:**
```
OPENAI_API_KEY=sk-proj-your-openai-key-here
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENTID=your-measurement-id
```

### 2. Build Configuration
- ✅ Framework: Next.js
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`
- ✅ Node.js Version: 18.x

### 3. Common Issues & Solutions

#### Issue 1: Styles Not Loading
**Problem:** Tailwind CSS not working in production
**Solution:** 
- Ensure `tailwind.config.ts` includes all paths
- Check `app/globals.css` has Tailwind directives
- Verify build process includes CSS compilation

#### Issue 2: 3D Components Failing
**Problem:** Three.js/React Three Fiber not rendering
**Solution:**
- Added `transpilePackages` in `next.config.mjs`
- Configured webpack externals for better compatibility
- Use dynamic imports for client-side components

#### Issue 3: API Routes Failing
**Problem:** Server functions timing out
**Solution:**
- Set proper runtime configuration
- Ensure environment variables are accessible
- Check API route exports are correct

#### Issue 4: Firebase Connection Issues
**Problem:** Firebase not connecting in production
**Solution:**
- Verify all `NEXT_PUBLIC_` prefixed variables are set
- Check Firebase project settings
- Ensure domain is added to Firebase authorized domains

## 🔧 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "fix: configure for Vercel deployment"
git push origin develop
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select the correct branch (develop)

### Step 3: Configure Environment Variables
1. In Vercel dashboard → Settings → Environment Variables
2. Add all required variables from your `.env.local`
3. Make sure to use the exact same names

### Step 4: Deploy
1. Trigger deployment from Vercel dashboard
2. Monitor build logs for any errors
3. Test all functionality after deployment

## 🧪 Testing Checklist

After deployment, test these features:
- [ ] Login/Signup functionality
- [ ] Dashboard loads correctly
- [ ] Chat with AI works
- [ ] Visualization (3D/FLOW/IMAGE) renders
- [ ] Roadmap generation works
- [ ] All pages load without errors

## 🐛 Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Ensure TypeScript errors are resolved

### Runtime Errors
1. Check Function logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Test API endpoints individually

### Styling Issues
1. Clear browser cache
2. Check if CSS files are being served
3. Verify Tailwind configuration

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Test locally with `npm run build && npm start`

## 🎯 Performance Tips

1. **Optimize Images:** Use Next.js Image component
2. **Code Splitting:** Use dynamic imports for heavy components
3. **Caching:** Configure proper cache headers
4. **Bundle Size:** Monitor and optimize bundle size

---

**Note:** This configuration has been tested and optimized for the Gyan Setu learning platform.