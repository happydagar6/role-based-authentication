# Deployment Guide for Role-Based Authentication App

## Prerequisites

1. **Supabase Account** - [supabase.com](https://supabase.com)
2. **Vercel Account** - [vercel.com](https://vercel.com) (for frontend)
3. **Railway Account** - [railway.app](https://railway.app) (for backend)
4. **GitHub Account** (to push your code)

---

## Step 1: Prepare Your Supabase Database

### 1.1 Set up Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the project to be ready (2-3 minutes)

### 1.2 Create Users Table
1. Go to **Table Editor** in your Supabase dashboard
2. Click **Create a new table**
3. Use this SQL to create the table:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.3 Apply RLS Policies
1. Go to **SQL Editor** in Supabase
2. Copy and paste the content from `supabase-rls-policies.sql`
3. Click **Run** to apply all policies

### 1.4 Get Your Supabase Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - Project URL
   - Project API Key (anon/public)
   - Service Role Key (keep this secret!)

---

## Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository
```bash
# In your project root directory
git init
git add .
git commit -m "Initial commit: Role-based authentication app"
```

### 2.2 Create GitHub Repository
1. Go to GitHub and create a new repository
2. Name it `role-auth-app` or similar
3. Don't initialize with README (since you already have code)

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Railway

### 3.1 Set up Railway
1. Go to [Railway](https://railway.app)
2. Sign up/Login with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Choose the **backend** folder

### 3.2 Configure Environment Variables
In Railway dashboard:
1. Go to **Variables** tab
2. Add these environment variables:

```
NODE_ENV=production
PORT=8080
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### 3.3 Configure Build Settings
1. Go to **Settings** tab
2. Set **Root Directory** to `backend`
3. Railway should auto-detect Node.js and use `npm start`

### 3.4 Get Your Backend URL
1. After deployment, go to **Settings** tab
2. Under **Environment**, click **Generate Domain**
3. Copy the generated URL (e.g., `https://your-app.railway.app`)

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Set up Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **New Project**
4. Import your GitHub repository
5. Select **frontend** as the root directory

### 4.2 Configure Build Settings
In Vercel:
1. **Framework Preset**: Next.js
2. **Root Directory**: frontend
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`

### 4.3 Configure Environment Variables
In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### 4.4 Deploy
1. Click **Deploy**
2. Wait for build to complete (2-3 minutes)
3. Your app will be available at a Vercel URL

---

## Step 5: Create Your First Admin User

Since your app requires an admin to manage users, you need to create one manually:

### 5.1 Using Supabase SQL Editor
1. Go to **SQL Editor** in Supabase
2. Run this query to create an admin user:

```sql
INSERT INTO users (name, email, password, role) 
VALUES (
  'Admin User', 
  'admin@example.com', 
  '$2b$10$example_hashed_password', -- You'll need to hash this
  'ADMIN'
);
```

### 5.2 Better Method: Use Your App
1. Go to your deployed frontend URL
2. Sign up normally with your admin credentials
3. Go to Supabase **Table Editor**
4. Find your user record and change `role` from 'USER' to 'ADMIN'
5. Log out and log back in

---

## Step 6: Final Configuration

### 6.1 Update CORS (if needed)
In your backend `server.js`, the CORS should already allow your Vercel domain. If you have issues:

```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### 6.2 Test Your Deployment
1. Visit your frontend URL
2. Test signup/login
3. Test admin panel (after creating admin user)
4. Test user management features

---

## Step 7: Custom Domain (Optional)

### 7.1 For Frontend (Vercel)
1. Go to your project in Vercel
2. **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed

### 7.2 For Backend (Railway)
1. Go to your project in Railway
2. **Settings** → **Domains**
3. Add custom domain
4. Update DNS records

---

## Environment Variables Summary

### Backend (.env)
```
NODE_ENV=production
PORT=8080
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

---

## Security Checklist

✅ RLS policies applied to Supabase
✅ Environment variables set correctly
✅ CORS configured for your domains
✅ JWT secret is strong and secure
✅ Service role key is kept secret
✅ First admin user created

---

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Check backend CORS configuration
2. **API Connection Failed**: Verify NEXT_PUBLIC_API_URL is correct
3. **Database Access Denied**: Check RLS policies are applied
4. **JWT Errors**: Ensure JWT_SECRET is set and consistent

### Logs:
- **Backend**: Check Railway logs in dashboard
- **Frontend**: Check Vercel functions logs
- **Database**: Check Supabase logs

---

## Cost Estimation

- **Supabase**: Free tier (500MB database, 50GB bandwidth)
- **Railway**: Free tier ($5 credit/month)
- **Vercel**: Free tier (hobby projects)

**Total: $0/month** for small-scale usage!

---

Your app should now be fully deployed and secure! 🚀