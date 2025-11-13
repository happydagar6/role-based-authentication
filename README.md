# Role-Based Authentication Application

A full-stack web application with role-based authentication featuring user signup, login, and role-specific dashboards.

## 🚀 Features

- **Authentication System**
  - User signup with role selection (User/Admin)
  - Secure login with JWT tokens
  - Password hashing with bcrypt
  - Protected routes

- **Role-Based Dashboard**
  - Different UI for User and Admin roles
  - Welcome header with user info and role display
  - Role-specific content and features
  - Logout functionality

- **Security**
  - JWT token-based authentication
  - Password hashing
  - Protected API endpoints
  - Token verification middleware

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Supabase
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled

### Frontend
- **Next.js 16** with TypeScript
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Zustand** for state management
- **Axios** for API calls

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account and project setup
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd role-auth-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```env
PORT=4000
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
JWT_SECRET=your_jwt_secret_here
```

Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Database Setup

Create a `users` table in your Supabase project:

```sql
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚦 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
# or
node src/server.js
```
Server will run on: http://localhost:4000

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Application will run on: http://localhost:3000

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/` | User signup | `{name, email, password, role}` |
| POST | `/api/auth/login` | User login | `{email, password}` |
| GET | `/api/auth/me` | Get current user | Headers: `Authorization: Bearer <token>` |
| POST | `/api/auth/logout` | User logout | Headers: `Authorization: Bearer <token>` |

### Example API Usage

**Signup:**
```bash
curl -X POST http://localhost:4000/api/auth/ \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"USER"}'
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Current User:**
```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
  http://localhost:4000/api/auth/me
```

## 🎯 User Flow

1. **Homepage** (`/`) - Redirects to login if not authenticated, dashboard if authenticated
2. **Login** (`/login`) - User authentication with email/password
3. **Signup** (`/signup`) - Account creation with role selection
4. **Dashboard** (`/dashboard`) - Protected route showing role-specific content

## 🔐 Security Features

- JWT tokens with expiration (7 days)
- Password hashing using bcrypt
- Protected routes with token verification
- CORS configuration
- Input validation and sanitization
- Error handling with appropriate status codes

## 🌐 Deployment

### Backend Deployment (Render/Railway)

1. Connect your GitHub repository
2. Set environment variables in the platform
3. Deploy from `backend` folder

### Frontend Deployment (Vercel/Netlify)

1. Connect your GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set environment variables
4. Deploy

### Environment Variables for Production

**Backend:**
```env
PORT=4000
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_supabase_key
JWT_SECRET=your_production_jwt_secret
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## 🧪 Testing

### Test the Authentication Flow

1. **Signup:** Create a new account with User role
2. **Login:** Sign in with the created credentials
3. **Dashboard:** Verify role-specific content displays
4. **Logout:** Test logout functionality
5. **Admin Test:** Create an admin account and verify admin dashboard

### Manual Testing with Postman

Import the provided Postman collection or use the curl commands above to test all endpoints.

## 📁 Project Structure

```
role-auth-app/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── verifyToken.js
│   │   ├── routes/
│   │   │   └── auth.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── login/
│   │       │   └── page.tsx
│   │       ├── signup/
│   │       │   └── page.tsx
│   │       ├── lib/
│   │       │   └── api.ts
│   │       ├── store/
│   │       │   └── useUserStore.ts
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── .env.local
│   ├── .env.example
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured properly
2. **Token Issues**: Check JWT_SECRET consistency between environments
3. **Database Connection**: Verify Supabase credentials and table structure
4. **Port Conflicts**: Change ports if 3000 or 4000 are in use

### Debug Mode

Enable debug mode by adding console logs in:
- `src/app/lib/api.ts` for API calls
- Backend middleware for token verification
- User store for state management

## 📝 License

This project is for educational purposes as part of an assignment.

## 👥 Contributing

This is an assignment project. Please follow the specified requirements and guidelines.