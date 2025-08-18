# RealEstate CRM - Multi-Tenant SaaS for Real Estate

A production-ready, pipeline-first CRM SaaS built specifically for real estate brokerages. Features multi-tenant architecture, kanban deal management, property inventory, and automation tools.

## 🚀 Features

### Core Functionality
- **Multi-Tenant Architecture**: Complete tenant isolation with subdomain support
- **Pipeline Management**: Drag-and-drop kanban boards for deal tracking
- **Property Management**: Comprehensive property inventory with images and specs
- **Contact & Lead Management**: CRM functionality with automated follow-ups
- **Site Visit Scheduling**: Calendar integration with automated notifications
- **Commission Tracking**: Calculate and track agent commissions
- **PDF Generation**: Property shortlists and documents
- **Team Collaboration**: Role-based access control (Owner, Admin, Agent, etc.)

### Integrations
- **Email**: SendGrid/SMTP for notifications and invites
- **WhatsApp/SMS**: Twilio integration for visit confirmations
- **Payments**: Stripe & Razorpay for subscription management
- **Calendar**: Google Calendar integration for site visits
- **Maps**: Google Maps for property locations

### Automation
- **Rule Engine**: Automated actions based on deal stage changes
- **Email Notifications**: Welcome emails, follow-ups, reminders
- **WhatsApp Alerts**: Visit confirmations and property updates
- **Daily Reminders**: Overdue follow-ups and pending tasks

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (with SQLite fallback for development)
- **ORM**: Drizzle ORM
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer
- **Email**: Nodemailer/SendGrid
- **Automation**: Node-cron
- **PDF Generation**: Puppeteer

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI & Custom Components
- **Routing**: Wouter
- **State Management**: React Query (TanStack Query)
- **Drag & Drop**: React Beautiful DnD
- **Forms**: React Hook Form with Zod validation

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ (or use SQLite for development)
- Git

### Quick Start (Replit)

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd realestate-crm
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # For PostgreSQL
   npm run db:push
   
   # Seed demo data
   node seed.js
   