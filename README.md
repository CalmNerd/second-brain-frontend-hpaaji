# Second Brain Frontend - Authentication System

## Overview

This project implements a complete authentication system with signup and signin functionality, JWT token management, and protected routes.

## Features

### Authentication Components

1. **Signup Component** (`/src/pages/Signup.tsx`)
   - Username and password input fields
   - Form validation (required fields, password length)
   - API integration with `/api/v1/signup` endpoint
   - Success alert and navigation to login page
   - Error handling with user-friendly messages

2. **Login Component** (`/src/pages/Login.tsx`)
   - Username and password input fields
   - Form validation
   - API integration with `/api/v1/signin` endpoint
   - JWT token storage in localStorage
   - Success alert and navigation to dashboard
   - Error handling

3. **Protected Route Component** (`/src/components/ProtectedRoute.tsx`)
   - Authentication check before rendering protected content
   - Automatic redirect to login page for unauthenticated users
   - Configurable redirect path

### Utility Functions

1. **Auth Utilities** (`/src/utils/auth.ts`)
   - `storeToken(token: string)` - Stores JWT token in localStorage
   - `getToken()` - Retrieves JWT token from localStorage
   - `removeToken()` - Removes JWT token from localStorage
   - `isAuthenticated()` - Checks if user is authenticated
   - `getAuthHeader()` - Creates Authorization header for API requests

2. **API Service** (`/src/utils/api.ts`)
   - `signupUser(username, password)` - Handles user registration
   - `signinUser(username, password)` - Handles user authentication
   - `apiRequest<T>(endpoint, options)` - Generic authenticated API request function
   - Centralized error handling and response processing

### Navigation & Routing

- **App.tsx** - Main routing configuration with protected routes
- **Header Component** - Includes logout functionality
- Automatic redirects based on authentication status

## API Endpoints

### Backend Endpoints (Already Implemented)

- `POST /api/v1/signup` - User registration
- `POST /api/v1/signin` - User authentication (returns JWT token)

### Frontend Integration

- All API calls use the centralized API service
- Proper error handling and user feedback
- JWT token automatically included in authenticated requests

## Security Features

1. **JWT Token Management**
   - Secure storage in localStorage
   - Automatic token inclusion in API requests
   - Token removal on logout

2. **Protected Routes**
   - Authentication verification before access
   - Automatic redirects for unauthorized access

3. **Form Validation**
   - Client-side validation for required fields
   - Password strength requirements
   - User-friendly error messages

4. **Error Handling**
   - Network error handling
   - API error response processing
   - Graceful fallbacks

## Usage

### Signup Flow
1. User navigates to `/signup`
2. Enters username and password
3. Form validates input
4. API call to `/api/v1/signup`
5. Success alert shown
6. Redirected to login page

### Login Flow
1. User navigates to `/login`
2. Enters username and password
3. Form validates input
4. API call to `/api/v1/signin`
5. JWT token stored in localStorage
6. Success alert shown
7. Redirected to dashboard

### Logout Flow
1. User clicks logout button in header
2. JWT token removed from localStorage
3. Success alert shown
4. Redirected to login page

## Code Quality

- **SOLID Principles**: Single responsibility, dependency inversion
- **Clean Code**: Comprehensive comments, meaningful function names
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Error Handling**: Robust error handling at multiple levels
- **Modularity**: Separated concerns with utility functions and components

## Dependencies

- React Router for navigation
- TypeScript for type safety
- Tailwind CSS for styling
- Local Storage for token persistence
