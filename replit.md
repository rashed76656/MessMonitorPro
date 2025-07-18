# Mess Monitor Web Application

## Overview

This is a full-stack web application for managing hostel mess operations, built with React/TypeScript frontend and Express.js backend. The application provides role-based authentication using Firebase Auth, allowing both mess administrators and borders to manage their respective functions through dedicated interfaces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state, React hooks for local state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Firebase Authentication
- **Session Management**: Express sessions with PostgreSQL store
- **API Structure**: RESTful endpoints with /api prefix

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations in `/migrations`
- **In-Memory Storage**: Fallback memory storage for development

## Key Components

### Authentication System
- **Provider**: Firebase Authentication
- **User Roles**: Admin and Border roles with different access levels
- **Role-Based Routing**: Automatic redirection based on user role
- **Admin Secret**: Additional security layer for admin registration
- **User Profiles**: Extended user metadata stored in Firestore

### User Interface Components
- **Login/Register Forms**: Form validation with react-hook-form and zod
- **Admin Dashboard**: Comprehensive management interface with tabs for borders, funds, and reports
- **Border Profile**: Individual user profile management with editing capabilities
- **Fund Management**: Transaction tracking with income/expense categorization
- **Printable Receipts**: Formatted receipt generation for financial records

### Data Models
- **User Model**: Comprehensive user profiles with role-based fields
- **Fund Transactions**: Financial transaction tracking with metadata
- **Fines System**: Fine tracking with status management
- **Statistics**: Aggregated data for dashboard metrics

## Data Flow

1. **Authentication Flow**:
   - User registers/logs in via Firebase Auth
   - User profile created/retrieved from Firestore
   - Role-based redirection to appropriate interface

2. **Admin Operations**:
   - View and manage all border profiles
   - Track fund transactions (income/expense)
   - Generate reports and statistics
   - Manage fines and dues

3. **Border Operations**:
   - View personal profile and financial status
   - Edit personal information (if permitted)
   - View transaction history and dues

4. **Data Persistence**:
   - User authentication handled by Firebase
   - User profiles and application data stored in Firestore
   - Real-time updates via Firestore listeners

## External Dependencies

### Authentication & Database
- **Firebase Services**: Auth, Firestore, and Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations

### UI & Styling
- **Radix UI**: Accessible primitive components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Icon library for UI elements

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Development database connection via DATABASE_URL

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push`

### Environment Configuration
- **Firebase Config**: Environment variables for Firebase project
- **Database URL**: PostgreSQL connection string
- **Session Secret**: Secure session management

### Key Architectural Decisions

1. **Hybrid Authentication**: Firebase Auth for user management with Firestore for extended profiles provides scalability and security
2. **Role-Based Access**: Clear separation between admin and border interfaces ensures appropriate access control
3. **Real-time Updates**: Firestore listeners provide live data synchronization across users
4. **Type Safety**: Full TypeScript implementation with shared schemas ensures code reliability
5. **Component Architecture**: Modular UI components with shadcn/ui for consistency and maintainability
6. **Database Strategy**: Drizzle ORM with PostgreSQL for complex queries while maintaining Firestore for user data

## Recent Updates (January 18, 2025)

### Issues Fixed
- ✓ Fixed registration error by updating user profile creation to handle partial data
- ✓ Restricted profile editing to admin-only (borders cannot edit their profiles)
- ✓ Fixed layout overflow issues in announcements and reports sections with responsive design
- ✓ Enhanced error handling for notifications to prevent crashes

### New Features Added
1. **Statistics Dashboard**: Enhanced admin dashboard with comprehensive statistics
   - New borders this month
   - Pending feedbacks count
   - Active announcements
   - Notification counts

2. **Announcement System**:
   - Admin can create announcements with priority levels (low/medium/high)
   - Automatic notification generation for all borders
   - Real-time announcement management
   - Announcement deletion and editing capabilities

3. **Notification System**:
   - Real-time notifications for borders
   - Bell icon with unread count in navbar
   - Mark individual or all notifications as read
   - Auto-generated notifications from announcements

4. **Feedback System**:
   - Borders can submit feedback with ratings (1-5 stars)
   - Categorized feedback (food, service, management, facilities, other)
   - Admin can view, respond to, and resolve feedback
   - Status tracking (pending, reviewed, resolved)

5. **Enhanced User Interface**:
   - New tabs in admin dashboard for announcements and feedbacks
   - Notification panel for borders
   - Feedback modal for border submission
   - View feedback modal for admin responses

### Technical Implementation
- Added new Firestore collections: announcements, notifications, feedbacks
- Created comprehensive type definitions for new features
- Implemented real-time listeners for live updates
- Added new UI components with proper error handling
- Enhanced navbar with notification and feedback buttons for borders