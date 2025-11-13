# ✅ Production Deployment Checklist

## 🏁 Pre-Deployment Verification

- [ ] App works perfectly in development
- [ ] Sign up with USER role works
- [ ] Sign up with ADMIN role works  
- [ ] Login works for both roles
- [ ] Admin can access user management
- [ ] Admin can create/edit/delete users
- [ ] Users are blocked from admin pages
- [ ] RLS policies applied and working

---

## 🚀 Deployment Steps

### Step 1: GitHub Repository
- [ ] Code pushed to GitHub repository
- [ ] Repository is public or accessible to deployment platforms
- [ ] All files committed (no pending changes)

### Step 2: Backend Deployment (Railway)
- [ ] Railway account created/logged in
- [ ] Project created from GitHub repo
- [ ] Root directory set to `backend`
- [ ] Environment variables configured:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=8080` 
  - [ ] `SUPABASE_URL=https://qawkvxsouakoezzzvqol.supabase.co`
  - [ ] `SUPABASE_SERVICE_KEY=your_service_key`
  - [ ] `JWT_SECRET=your_jwt_secret`
- [ ] Deployment successful (green status)
- [ ] Domain generated and noted down
- [ ] Backend health check works: `https://your-backend.railway.app/api/health`

### Step 3: Frontend Deployment (Vercel)
- [ ] Vercel account created/logged in
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] Framework preset: Next.js
- [ ] Environment variables configured:
  - [ ] `NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api`
- [ ] Deployment successful
- [ ] Frontend loads without errors
- [ ] API calls go to production backend (check Network tab)

### Step 4: CORS Configuration
- [ ] Backend CORS updated with Vercel URL
- [ ] Changes committed and pushed
- [ ] Backend redeployed automatically
- [ ] Frontend can successfully call backend APIs

---

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Frontend loads successfully
- [ ] No console errors in browser
- [ ] API calls reach backend (Network tab shows correct URLs)
- [ ] Backend responds to API calls (no 500 errors)

### Authentication Flow
- [ ] Sign up form loads
- [ ] Can select USER role
- [ ] Can select ADMIN role
- [ ] Sign up creates user successfully
- [ ] Login works with created credentials
- [ ] JWT token is generated and stored
- [ ] Dashboard loads after login
- [ ] Logout works correctly

### Role-Based Access
- [ ] USER role sees user dashboard
- [ ] USER role is blocked from `/users` page
- [ ] ADMIN role sees admin dashboard
- [ ] ADMIN role can access `/users` page
- [ ] ADMIN role can perform all CRUD operations

### Admin User Management
- [ ] Can view all users in table
- [ ] Search functionality works
- [ ] Role filter works
- [ ] Can create new users
- [ ] Can edit existing users
- [ ] Can delete users
- [ ] Modal forms work properly
- [ ] Form validation works
- [ ] Success/error messages display

---

## 🔍 Security Verification

### Database Security
- [ ] RLS policies are enabled on users table
- [ ] Service role access policy exists
- [ ] Public signup policy allows registration
- [ ] User/admin access policies are correct
- [ ] Direct database access is blocked (test with anon key)

### API Security
- [ ] JWT tokens are properly signed
- [ ] Protected routes require authentication
- [ ] Admin routes require admin role
- [ ] CORS only allows your domains
- [ ] Sensitive data not exposed in responses

### Environment Security
- [ ] Service role key is set correctly
- [ ] JWT secret is strong and secure
- [ ] No sensitive data in public repositories
- [ ] Environment variables are properly scoped

---

## 🌐 Performance & Monitoring

### Frontend Performance
- [ ] Page load times under 3 seconds
- [ ] Images/assets load quickly
- [ ] No unnecessary API calls
- [ ] Proper error handling for failed requests

### Backend Performance  
- [ ] API responses under 1 second
- [ ] Database queries optimized
- [ ] Proper error handling and logging
- [ ] Memory usage within limits

---

## 📋 Post-Deployment Tasks

### Initial Setup
- [ ] Create your first admin account
- [ ] Test full admin workflow
- [ ] Create test users for verification
- [ ] Document admin credentials securely

### Monitoring Setup (Optional)
- [ ] Set up Railway monitoring alerts
- [ ] Configure Vercel analytics
- [ ] Set up Supabase monitoring
- [ ] Monitor error rates and performance

### Documentation
- [ ] Update README with live URLs
- [ ] Document deployment process
- [ ] Create user guide for admin features
- [ ] Document any custom configurations

---

## 🚨 Troubleshooting

### If Frontend Won't Load
- [ ] Check Vercel build logs
- [ ] Verify `NEXT_PUBLIC_API_URL` is correct
- [ ] Check for console errors
- [ ] Verify all dependencies installed

### If API Calls Fail
- [ ] Check Railway backend logs
- [ ] Verify CORS configuration
- [ ] Test backend URL directly
- [ ] Check environment variables

### If Authentication Fails
- [ ] Verify JWT secret matches
- [ ] Check Supabase service key
- [ ] Test RLS policies
- [ ] Check database connection

### If RLS Blocks Operations
- [ ] Verify service role policy exists
- [ ] Check backend uses service key
- [ ] Test policies with SQL editor
- [ ] Ensure policies are correctly applied

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ **Users can sign up and login**  
✅ **Admins can manage users**  
✅ **Security policies are enforced**  
✅ **All features work in production**  
✅ **No critical errors or failures**  
✅ **Performance is acceptable**  

---

## 📱 Final URLs

After successful deployment, update these:

```
🌐 Frontend: https://_________________.vercel.app
🔧 Backend:  https://_________________.railway.app  
💾 Database: https://supabase.com/dashboard/project/qawkvxsouakoezzzvqol
```

**Congratulations! Your app is now live! 🎉**