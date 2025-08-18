# Overview

RealEstate CRM is a production-ready multi-tenant SaaS platform built specifically for real estate brokerages. The application follows a pipeline-first approach where the primary user experience centers around kanban-style deal management. Each brokerage operates as a separate tenant with complete data isolation, subdomain support, and role-based access control. The system includes comprehensive property management, contact/lead tracking, site visit scheduling, commission calculations, and automation features.

The application is designed as a full-stack monorepo with modern technologies, targeting real estate professionals who need to manage properties, track deals through sales pipelines, and collaborate with team members across different roles (owners, admins, agents, listing managers, and account managers).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Build System**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Custom component system built on Radix UI primitives with Tailwind CSS
- **Drag & Drop**: React Beautiful DnD for kanban board interactions
- **Form Management**: React Hook Form with Zod validation

The frontend follows a component-driven architecture with a clear separation between UI components (`/components/ui`), form components (`/components/forms`), and layout components (`/components/layout`). The application uses a dashboard layout pattern with a persistent sidebar and header for authenticated users.

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database Layer**: Drizzle ORM with PostgreSQL (Neon serverless)
- **Authentication**: JWT-based authentication with bcryptjs for password hashing
- **Multi-tenancy**: Middleware-based tenant resolution using JWT payload, subdomains, or headers
- **File Handling**: Multer for file uploads with local storage (designed for S3 extension)
- **Background Jobs**: Node-cron for scheduled tasks and automation rules

The backend implements a layered architecture with distinct separation of concerns:
- Route handlers manage HTTP requests and responses
- Middleware handles authentication, tenant resolution, and role-based access control
- Storage layer abstracts database operations
- Service layer contains business logic for automation, email, and integrations

## Multi-Tenant Data Architecture
- **Tenant Isolation**: Every business table includes a `tenant_id` column for data segregation
- **Row-Level Security**: Database schema prepared for RLS policies (commented examples included)
- **Tenant Resolution**: Hierarchical resolution from JWT → headers → subdomain
- **Cross-Tenant Prevention**: All database queries filtered by tenant_id through middleware

## Database Design
The schema follows a normalized relational design with proper foreign key relationships:
- **Core Tables**: tenants, users, user_tenants (many-to-many with roles)
- **Business Tables**: properties, contacts, leads, deals, pipelines, stages
- **Activity Tables**: site_visits, files, audit_logs
- **Extension Tables**: commissions, subscriptions

All tables use UUID primary keys and include proper indexing on tenant_id columns for query performance.

## Authentication & Authorization
- **Registration Flow**: Creates tenant + owner user + default pipelines in single transaction
- **JWT Structure**: Contains user_id and array of accessible tenant_ids
- **Role-Based Access**: Five-tier role system (OWNER → ADMIN → AGENT → LISTING_MANAGER → ACCOUNT)
- **Tenant Switching**: Users can belong to multiple tenants and switch context
- **Invitation System**: Email-based team member invitations with token validation

# External Dependencies

## Database & Storage
- **Primary Database**: Neon PostgreSQL serverless with connection pooling
- **Development Fallback**: SQLite support for local development environments
- **File Storage**: Local filesystem for development (architected for S3/Supabase migration)

## Email & Communication Services
- **Email Service**: Nodemailer with SMTP configuration (SendGrid integration ready)
- **SMS/WhatsApp**: Twilio integration structure prepared for site visit notifications
- **Calendar Integration**: Google Calendar API structure for site visit scheduling

## Payment Processing
- **Payment Providers**: Stripe and Razorpay webhook endpoints implemented
- **Subscription Management**: Basic subscription status tracking in tenant records

## UI Component Libraries
- **Component Primitives**: Radix UI for accessible, unstyled components
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **Icons**: Lucide React for consistent iconography
- **Drag & Drop**: React Beautiful DnD for kanban functionality

## Development & Deployment
- **Development Environment**: Replit integration with custom run configuration
- **Build Pipeline**: ESBuild for server bundling, Vite for client assets
- **Type Safety**: TypeScript across the entire stack with shared schema types
- **Validation**: Zod schemas for runtime validation and type inference

The application is designed for easy deployment to various platforms with Docker support prepared and environment-based configuration throughout.