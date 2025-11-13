# 🚀 Complete Deployment Guide

## 📋 Pre-Deployment Checklist

✅ RLS policies applied and working  
✅ Backend uses SUPABASE_SERVICE_KEY  
✅ Local authentication working  
✅ Admin and user roles functional  

---

## 🗂️ Step 1: Push Code to GitHub

```bash
# Initialize git if not done
git init
git add .
git commit -m "Production-ready role-based auth app"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/role-auth-app.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your `role-auth-app` repository
5. Choose **"backend"** folder as root directory

### 2.2 Configure Railway Settings
1. Go to **Settings** tab
2. Set **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

### 2.3 Set Environment Variables in Railway
Go to **Variables** tab and add these **EXACT** variables:

```env
NODE_ENV=production
PORT=8080
SUPABASE_URL=https://qawkvxsouakoezzzvqol.supabase.co
SUPABASE_SERVICE_KEY=your_actual_service_key_from_supabase
JWT_SECRET=468f3894e973d64706fd5dfc9365c62884c8fe8bcb5658915c41f92292e3fbbd55d953b6caf9931c71d46a161866cb705858aa09750258c2aa5efb36438b002d
```

⚠️ **Important**: Replace `your_actual_service_key_from_supabase` with your real service role key

### 2.4 Get Your Backend URL
1. After deployment, go to **Settings** → **Environment**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://role-auth-app-production.railway.app`)
4. **Save this URL** - you'll need it for frontend!

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project
1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`

### 3.2 Set Environment Variables in Vercel
Go to **Settings** → **Environment Variables** and add:

```env
NEXT_PUBLIC_API_URL=https://YOUR_RAILWAY_BACKEND_URL/api
```

**Replace** `YOUR_RAILWAY_BACKEND_URL` with the actual Railway URL you got in step 2.4

**Example**:
```env
NEXT_PUBLIC_API_URL=https://role-auth-app-production.railway.app/api
```

### 3.3 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Get your frontend URL (e.g., `https://your-app.vercel.app`)

---

## 🔧 Step 4: Update Backend CORS (Critical!)

Your backend needs to allow your production frontend domain.

### 4.1 Check Current CORS Settings
Your `backend/src/server.js` should have:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'YOUR_VERCEL_URL_HERE'],
  credentials: true
}));
```

### 4.2 Update CORS for Production
Add your Vercel URL to the CORS origins:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-actual-app.vercel.app'  // Add your real Vercel URL
  ],
  credentials: true
}));
```

### 4.3 Redeploy Backend
1. Commit and push the CORS changes to GitHub
2. Railway will automatically redeploy

---

## 👤 Step 5: Create Your First Admin User

Since you need an admin to manage users:

### Option A: Use Your App (Recommended)
1. Go to your deployed frontend URL
2. Click **"Sign Up"**
3. Fill form and select **"Admin"** role
4. Sign up successfully
5. You now have an admin account!

### Option B: Manual Database Update
1. Sign up as a regular user first
2. Go to Supabase → **Table Editor** → **users**
3. Find your user and change `role` from `USER` to `ADMIN`
4. Log out and back in

---

## 🔍 Step 6: Test Everything

### 6.1 Test User Flow
- ✅ Sign up as USER
- ✅ Login successfully
- ✅ Access dashboard (should show user view)
- ✅ Try accessing `/users` (should be denied)

### 6.2 Test Admin Flow
- ✅ Sign up as ADMIN
- ✅ Login successfully  
- ✅ Access dashboard (should show admin view)
- ✅ Access user management (`/users`)
- ✅ Create new users
- ✅ Edit existing users
- ✅ Delete users
- ✅ Search and filter users

---

## 📝 Environment Variables Summary

### Development (Local)
**Backend** `.env`:
```env
NODE_ENV=development
PORT=4000
SUPABASE_URL=https://qawkvxsouakoezzzvqol.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
```

**Frontend** `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Production
**Railway** (Backend):
```env
NODE_ENV=production
PORT=8080
SUPABASE_URL=https://qawkvxsouakoezzzvqol.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
```

**Vercel** (Frontend):
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## 🔒 Security Checklist

✅ **RLS Policies Applied** - Database is secure  
✅ **Service Role Key Used** - Backend can access DB  
✅ **JWT Secret is Strong** - 64+ character random string  
✅ **CORS Configured** - Only your domains allowed  
✅ **Environment Variables Set** - All secrets in place  
✅ **HTTPS Enabled** - Both Railway and Vercel use HTTPS  

---

## 💰 Cost Breakdown (Monthly)

- **Supabase**: FREE (500MB database, 50GB bandwidth)
- **Railway**: FREE ($5 credit monthly, unused = free)
- **Vercel**: FREE (unlimited hobby projects)

**Total Cost: $0/month** 🎉

---

## 🐛 Common Issues & Solutions

### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: Update CORS in `server.js` with your Vercel URL

### 2. Environment Variables Not Working
**Problem**: API calls fail
**Solution**: Double-check variable names match exactly

### 3. Database Connection Issues
**Problem**: Backend can't access Supabase
**Solution**: Verify SUPABASE_SERVICE_KEY is correct

### 4. Build Failures
**Problem**: Vercel build fails
**Solution**: Ensure all dependencies in `package.json`

---

## 🔧 Useful Commands

### Redeploy Backend
```bash
git add .
git commit -m "Update backend"
git push
# Railway auto-deploys
```

### Redeploy Frontend
```bash
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys
```

### Check Logs
- **Railway**: Dashboard → Logs tab
- **Vercel**: Dashboard → Functions tab
- **Supabase**: Dashboard → Logs section

---

## 🎯 Post-Deployment Tasks

1. **Test all user flows** thoroughly
2. **Create admin account** for management
3. **Set up monitoring** (optional)
4. **Configure custom domain** (optional)
5. **Set up backups** (Supabase auto-backups included)

---

**Your app is now production-ready and deployed! 🚀**

Frontend: `https://your-app.vercel.app`  
Backend: `https://your-backend.railway.app`  
Database: Secure with RLS policies  

**Next Steps**: Share your app and start managing users! 🎉