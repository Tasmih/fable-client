Fable – Ebook Sharing Platform
Project Overview

Fable is a modern ebook sharing platform that connects readers and writers in a single digital ecosystem. Readers can discover, explore, and purchase original ebooks, while writers can publish and manage their own content through a dedicated dashboard. The system is built with role-based access control, secure authentication, and integrated payment functionality.

Purpose

The purpose of this project is to build a scalable and interactive ebook platform where:

Readers can explore and purchase ebooks
Writers can publish, manage, and track their ebooks
Admin can manage users, ebooks, and transactions
Secure payment processing is handled via Stripe
A smooth and modern reading experience is provided for users
Key Features
Role-based authentication system (User, Writer, Admin)
Ebook browsing with search, filter, and sorting
Detailed ebook pages with purchase functionality
Stripe payment integration for secure transactions
Bookmark system for saving ebooks
Writer dashboard for managing ebooks and sales
Admin dashboard for platform management
Responsive UI for all devices
Framer Motion animations for enhanced user experience
Image upload support using imgBB
JWT-based authentication with secure session handling
Google login integration via BetterAuth
Pages Structure
Home Page
Hero section with banner and CTA
Featured ebooks section
Top writers section
Ebook genres section
Testimonials section
Browse Ebooks Page
Grid layout for ebooks
Search and filtering system
Sorting and pagination support
Ebook Details Page
Full ebook information display
Purchase system via Stripe
Bookmark functionality
Dashboards
User Dashboard
Purchase history
Bookmarked ebooks
Profile management
Writer Dashboard
Add new ebook
Edit existing ebooks
Manage published ebooks
View sales history
Admin Dashboard
Manage users (role control)
Manage all ebooks
Monitor transactions
View analytics dashboard
Technical Stack
Next.js 15
React
Node.js
Express.js
MongoDB
JWT Authentication
Stripe Payment Gateway
Framer Motion
Tailwind CSS
imgBB API
Environment Variables
Client Side
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_STRIPE_KEY
Server Side
MONGODB_URI
JWT_SECRET
STRIPE_SECRET_KEY
CLIENT_URL
Deployment Notes
Ensure proper CORS configuration in production
Backend must handle all API routes without errors
All pages must work on refresh (no route break)
Authentication must persist after reload
Stripe payment flow must work in production
No 404 or redirect issues on refresh
Important Rules
No UI errors on page reload
Role-based access must be properly enforced
API responses must remain consistent
Authentication must persist across sessions
Protected routes must not break on refresh
Security Notes

For security reasons, sensitive credentials such as admin access details are not included in this documentation. Admin accounts are managed securely at the database level or via system seeding.

Live Project

Live URL: https://fable-client-zeta.vercel.app
GitHub Repository (Client): https://github.com/Tasmih/fable-client
GitHub Repository (Server): https://github.com/Tasmih/fable-server