# Mess Monitor - Complete Deployment Guide

This guide provides detailed instructions for deploying your Mess Monitor application on different platforms.

## Option 1: Vercel (Frontend) + Render (Backend) + Firebase

This setup separates frontend and backend hosting for better scalability.

### Step 1: Prepare Your Project

1. **Split the project into frontend and backend folders:**
   ```bash
   mkdir mess-monitor-frontend
   mkdir mess-monitor-backend
   
   # Move frontend files
   cp -r client/* mess-monitor-frontend/
   cp package.json mess-monitor-frontend/
   cp vite.config.ts mess-monitor-frontend/
   cp tailwind.config.ts mess-monitor-frontend/
   cp postcss.config.js mess-monitor-frontend/
   cp tsconfig.json mess-monitor-frontend/
   
   # Move backend files
   cp -r server/* mess-monitor-backend/
   cp -r shared mess-monitor-backend/
   ```

2. **Update package.json for frontend (mess-monitor-frontend/package.json):**
   ```json
   {
     "name": "mess-monitor-frontend",
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

3. **Create package.json for backend (mess-monitor-backend/package.json):**
   ```json
   {
     "name": "mess-monitor-backend",
     "scripts": {
       "start": "node dist/index.js",
       "build": "esbuild index.ts --bundle --platform=node --target=node18 --outdir=dist --external:@neondatabase/serverless",
       "dev": "tsx index.ts"
     },
     "dependencies": {
       "express": "^4.18.2",
       "cors": "^2.8.5",
       "@neondatabase/serverless": "^0.7.2",
       "drizzle-orm": "^0.29.0"
     }
   }
   ```

### Step 2: Deploy Backend to Render

1. **Create GitHub repositories:**
   - Create `mess-monitor-backend` repository
   - Push your backend code to GitHub

2. **Sign up at Render.com:**
   - Go to https://render.com
   - Sign up with your GitHub account

3. **Create a Web Service:**
   - Click "New +" → "Web Service"
   - Connect your `mess-monitor-backend` repository
   - Configure settings:
     - **Name**: `mess-monitor-api`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Instance Type**: `Free` (or paid for better performance)

4. **Add Environment Variables in Render:**
   ```
   DATABASE_URL=your_neon_database_url
   NODE_ENV=production
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```

5. **Deploy Backend:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the backend URL: `https://mess-monitor-api.onrender.com`

### Step 3: Deploy Frontend to Vercel

1. **Update API calls in frontend:**
   Create `.env.production` in frontend folder:
   ```
   VITE_API_URL=https://mess-monitor-api.onrender.com
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. **Update API requests:**
   In `client/src/lib/queryClient.ts`, update the base URL:
   ```typescript
   const apiRequest = async (url: string, options: RequestInit = {}) => {
     const baseUrl = import.meta.env.VITE_API_URL || '';
     const response = await fetch(`${baseUrl}${url}`, {
       ...options,
       headers: {
         'Content-Type': 'application/json',
         ...options.headers,
       },
     });
     // rest of the code...
   };
   ```

3. **Deploy to Vercel:**
   - Push frontend code to GitHub repository
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your frontend repository
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add environment variables in Vercel dashboard
   - Deploy

### Step 4: Configure Firebase

1. **Update Firebase authorized domains:**
   - Go to Firebase Console
   - Authentication → Settings → Authorized domains
   - Add your Vercel domain: `your-app.vercel.app`

2. **Update CORS in backend:**
   In your backend code, update CORS settings:
   ```typescript
   app.use(cors({
     origin: [
       'https://your-app.vercel.app',
       'http://localhost:3000' // for development
     ]
   }));
   ```

---

## Option 2: InfinityFree Hosting + Firebase Integration

This option uses traditional web hosting with Firebase for backend services.

### Step 1: Prepare for Static Hosting

1. **Build the project for production:**
   ```bash
   npm run build
   ```

2. **Since InfinityFree doesn't support Node.js, modify the app to be Firebase-only:**
   
   Update `client/src/lib/queryClient.ts` to use Firebase functions instead of Express:
   ```typescript
   // Remove Express API calls, use Firebase Firestore directly
   import { db } from './firebase';
   import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
   ```

### Step 2: Create Firebase Functions (Backend Replacement)

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase Functions:**
   ```bash
   firebase init functions
   ```

3. **Create Firebase Functions (functions/src/index.ts):**
   ```typescript
   import { onRequest } from "firebase-functions/v2/https";
   import { logger } from "firebase-functions";
   import admin from "firebase-admin";

   admin.initializeApp();

   export const getUserStats = onRequest(async (request, response) => {
     try {
       const db = admin.firestore();
       // Your statistics logic here
       const users = await db.collection('users').get();
       const stats = {
         totalBorders: users.size,
         // Add other statistics...
       };
       
       response.json(stats);
     } catch (error) {
       logger.error("Error getting stats:", error);
       response.status(500).json({ error: "Internal Server Error" });
     }
   });

   export const manageFunds = onRequest(async (request, response) => {
     try {
       const { method } = request;
       const db = admin.firestore();
       
       if (method === 'POST') {
         const fundData = request.body;
         await db.collection('funds').add({
           ...fundData,
           timestamp: admin.firestore.FieldValue.serverTimestamp()
         });
         response.json({ success: true });
       }
       
       if (method === 'GET') {
         const funds = await db.collection('funds').orderBy('timestamp', 'desc').get();
         const fundsList = funds.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         response.json(fundsList);
       }
     } catch (error) {
       logger.error("Error managing funds:", error);
       response.status(500).json({ error: "Internal Server Error" });
     }
   });
   ```

4. **Deploy Firebase Functions:**
   ```bash
   firebase deploy --only functions
   ```

### Step 3: Update Frontend for Firebase-Only Architecture

1. **Update service files to use Firebase directly:**
   
   Create `client/src/services/firebase-api.ts`:
   ```typescript
   import { db } from '@/lib/firebase';
   import { 
     collection, 
     doc, 
     getDocs, 
     addDoc, 
     updateDoc, 
     deleteDoc, 
     query, 
     orderBy, 
     where,
     serverTimestamp 
   } from 'firebase/firestore';

   // Replace all Express API calls with Firestore operations
   export const getFunds = async () => {
     const q = query(collection(db, 'funds'), orderBy('timestamp', 'desc'));
     const snapshot = await getDocs(q);
     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   };

   export const addFund = async (fundData: any) => {
     return await addDoc(collection(db, 'funds'), {
       ...fundData,
       timestamp: serverTimestamp()
     });
   };

   // Add similar functions for other operations...
   ```

2. **Update React components:**
   Replace all API calls in your components:
   ```typescript
   // Instead of:
   // const { data: funds } = useQuery({ queryKey: ['/api/funds'] });
   
   // Use:
   const [funds, setFunds] = useState([]);
   useEffect(() => {
     getFunds().then(setFunds);
   }, []);
   ```

### Step 4: Build and Deploy to InfinityFree

1. **Build the static version:**
   ```bash
   npm run build
   ```

2. **Prepare files for upload:**
   ```bash
   # The dist folder contains your built application
   # You'll upload these files to InfinityFree
   ```

3. **Sign up at InfinityFree:**
   - Go to https://infinityfree.net
   - Create free account
   - Create new website

4. **Upload files via File Manager:**
   - Login to your InfinityFree control panel
   - Open File Manager
   - Navigate to `htdocs` folder
   - Upload all files from your `dist` folder
   - Make sure `index.html` is in the root of `htdocs`

5. **Configure domain:**
   - In InfinityFree panel, note your free subdomain
   - Update Firebase authorized domains
   - Add your InfinityFree domain to Firebase Console

### Step 5: Configure Firebase for Production

1. **Update Firebase Security Rules:**
   ```javascript
   // Firestore Security Rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Admins can read all user data
       match /users/{userId} {
         allow read: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       
       // All authenticated users can read announcements
       match /announcements/{announcementId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
       
       // Similar rules for other collections...
     }
   }
   ```

2. **Update Firebase hosting configuration:**
   ```json
   // firebase.json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

---

## Important Security Notes

### For Both Deployment Options:

1. **Environment Variables:**
   - Never commit API keys to GitHub
   - Use platform-specific environment variable settings
   - Rotate keys regularly

2. **Firebase Security:**
   - Set up proper Firestore security rules
   - Enable Firebase App Check for production
   - Monitor usage and set budgets

3. **Domain Security:**
   - Always add your production domains to Firebase authorized domains
   - Use HTTPS only in production
   - Set up proper CORS policies

### Testing Your Deployment:

1. **Test user registration/login**
2. **Test admin dashboard functionality**
3. **Test all CRUD operations**
4. **Test responsive design on mobile**
5. **Check browser console for errors**

### Maintenance:

1. **Regular backups of Firebase data**
2. **Monitor application performance**
3. **Update dependencies regularly**
4. **Monitor Firebase usage and costs**

Choose the deployment option that best fits your needs. Option 1 (Vercel + Render) provides more backend flexibility, while Option 2 (InfinityFree + Firebase) is completely free but requires restructuring your app to be Firebase-centric.