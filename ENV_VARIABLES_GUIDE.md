# 🔄 Environment Variable Migration Guide

## 📊 Current vs Production Environment Variables

### Backend Environment Variables

| Variable | Development Value | Production Value | Notes |
|----------|------------------|------------------|--------|
| `NODE_ENV` | `development` | `production` | **MUST CHANGE** for Railway |
| `PORT` | `4000` | `8080` | **MUST CHANGE** (Railway default) |
| `SUPABASE_URL` | ✅ Same | ✅ Same | Keep identical |
| `SUPABASE_SERVICE_KEY` | ✅ Same | ✅ Same | Keep identical (secure) |
| `JWT_SECRET` | ✅ Same | ✅ Same | Keep identical |

### Frontend Environment Variables

| Variable | Development Value | Production Value | Notes |
|----------|------------------|------------------|--------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | `https://your-backend.railway.app/api` | **MUST CHANGE** to Railway URL |

---

## 🔧 Step-by-Step Variable Updates

### 1. Backend (Railway Platform)

**Go to Railway Dashboard → Your Project → Variables Tab**

```env
# ❌ REMOVE these development values:
PORT=4000
NODE_ENV=development

# ✅ ADD these production values:
NODE_ENV=production
PORT=8080
SUPABASE_URL=https://qawkvxsouakoezzzvqol.supabase.co
SUPABASE_SERVICE_KEY=your_actual_service_key_from_supabase_settings
JWT_SECRET=468f3894e973d64706fd5dfc9365c62884c8fe8bcb5658915c41f92292e3fbbd55d953b6caf9931c71d46a161866cb705858aa09750258c2aa5efb36438b002d
```

### 2. Frontend (Vercel Platform)

**Go to Vercel Dashboard → Your Project → Settings → Environment Variables**

```env
# ❌ REMOVE this development value:
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# ✅ ADD this production value:
NEXT_PUBLIC_API_URL=https://your-actual-railway-url.railway.app/api
```

**Example with real URL**:
```env
NEXT_PUBLIC_API_URL=https://role-auth-production-a1b2c3.railway.app/api
```

---

## ⚠️ Critical Notes

### Getting Your Railway Backend URL
1. Deploy backend first to Railway
2. Go to **Settings** → **Environment** → **Generate Domain**
3. Copy the generated URL (e.g., `https://role-auth-production-a1b2c3.railway.app`)
4. Add `/api` to the end for frontend env variable

### Getting Your Supabase Service Key
1. Go to Supabase Dashboard → **Settings** → **API**
2. Copy the **service_role** key (NOT the anon key)
3. This key starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🔄 Deployment Order

**IMPORTANT**: Deploy in this exact order to avoid connection issues:

1. **Deploy Backend First** (Railway)
   - Get the Railway URL
   - Note it down
   
2. **Deploy Frontend Second** (Vercel)
   - Use the Railway URL in `NEXT_PUBLIC_API_URL`
   
3. **Update Backend CORS** (if needed)
   - Add Vercel URL to CORS origins
   - Redeploy backend

---

## 🧪 Testing Environment Variables

### After Backend Deployment
Test backend directly:
```bash
curl https://your-backend.railway.app/api/health
# Should return: {"status":"OK","timestamp":"..."}
```

### After Frontend Deployment
1. Open browser dev tools
2. Go to your Vercel app
3. Check Network tab
4. API calls should go to `https://your-backend.railway.app/api/*`

---

## 🚨 Common Mistakes to Avoid

❌ **Using localhost URLs in production**  
❌ **Mixing up anon key vs service key**  
❌ **Forgetting to update CORS**  
❌ **Wrong PORT number for Railway**  
❌ **Missing `/api` in frontend API URL**

✅ **Use full HTTPS URLs**  
✅ **Use service_role key for backend**  
✅ **Add production domains to CORS**  
✅ **Use PORT=8080 for Railway**  
✅ **Include `/api` path in frontend URL**

---

## 📝 Quick Reference

### Your Actual Values (Fill these in):
```
Supabase URL: https://qawkvxsouakoezzzvqol.supabase.co
Railway Backend URL: https://__________________.railway.app
Vercel Frontend URL: https://__________________.vercel.app
```

### Production Environment Setup:
```bash
# Railway (Backend)
NODE_ENV=production
PORT=8080
SUPABASE_URL=https://qawkvxsouakoezzzvqol.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret

# Vercel (Frontend) 
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

**Your app will be live at your Vercel URL! 🚀**