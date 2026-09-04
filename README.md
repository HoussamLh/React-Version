# DevBySam React-Version

A full-stack web application built with React and TypeScript, featuring customer and administrative workflows, authentication, project requests, content management, real-time live chat, database-backed functionality, and Cloudinary media handling.

## Overview

React-Version is the next-generation version of my DevBySam website and an ongoing full-stack software development project.

The original website was built using HTML, CSS, and JavaScript. React-Version represents the ongoing re-engineering of that application into a more structured full-stack system using React, TypeScript, Supabase/PostgreSQL, server-side APIs, authentication, real-time communication, and Cloudinary.

The project is being developed with an emphasis on feature separation, reusable components, structured data, access control, and maintainable application architecture.

## DevBySam — Previous Version

**React-Version is the next-generation version of my DevBySam website.**

The original DevBySam website was built using **HTML, CSS, and JavaScript** and remains available online at **devbysam.co.uk**.

This React-Version repository represents the ongoing re-engineering of the website into a more structured full-stack application using **React, TypeScript, Supabase/PostgreSQL, server-side APIs, authentication, real-time communication, Cloudinary, and a feature-based architecture**.

The two versions represent the evolution of the project from a traditional frontend implementation into a more maintainable and scalable software system.

### Previous Implementation

**Live website:** `https://devbysam.co.uk`

**Source code:** `HoussamLh / DevBySam`

The original repository contains the earlier HTML, CSS, and JavaScript implementation.



## Screenshots

### Home Page : 


<img width="1445" height="736" alt="Screenshot 2026-09-04 at 22 15 46" src="https://github.com/user-attachments/assets/1c25c943-4319-4655-a44a-31964c3baf94" />

### About Page : 


<img width="1445" height="736" alt="Screenshot 2026-09-04 at 22 15 52" src="https://github.com/user-attachments/assets/fadc37f1-b121-4334-9dc4-fb5a87d5d0fc" />

### Services Page : 


<img width="1445" height="736" alt="Screenshot 2026-09-04 at 22 22 23" src="https://github.com/user-attachments/assets/d0629ce0-8a96-4a68-9f8a-589a8a66748a" />


### Project Page : 


<img width="1445" height="736" alt="Screenshot 2026-09-04 at 22 22 33" src="https://github.com/user-attachments/assets/3fb18c58-a710-4857-ba5a-1b99a942b9fb" />


### Pricing Page : 


<img width="1445" height="736" alt="Screenshot 2026-09-04 at 22 16 10" src="https://github.com/user-attachments/assets/42fc581d-6e7d-4d83-bb07-47166c246bbf" />


### Contact Page : 


<img width="1445" height="736" alt="Screenshot 2026-09-04 at 22 16 38" src="https://github.com/user-attachments/assets/552938af-17ef-4a13-93a5-6ea03cf54cae" />


### Admin Dashboard : 


<img width="1445" height="736" alt="Screenshot 2026-09-04 at 22 13 59" src="https://github.com/user-attachments/assets/ba16f2c0-0d1e-4846-957e-a23f617e3ae5" />


### Customer Dashboard : 


<img width="1445" height="663" alt="Screenshot 2026-09-04 at 22 12 33" src="https://github.com/user-attachments/assets/e1b6ffc3-2bfb-4e2d-9920-a5e2190a5554" />


### Live Chat :
#### Live Chat Home :

<img width="417" height="720" alt="Screenshot 2026-09-04 at 22 10 07" src="https://github.com/user-attachments/assets/1b0d92c6-b925-4987-8ad7-c50aed2f6d05" /> 


#### Live Chat Messages :

<img width="417" height="720" alt="Screenshot 2026-09-04 at 22 10 17" src="https://github.com/user-attachments/assets/f17447f7-f75e-4af6-8b95-18d2bc5d6081" />


#### Live Chat Conversation:

<img width="417" height="720" alt="Screenshot 2026-09-04 at 22 10 31" src="https://github.com/user-attachments/assets/34f32d12-5b0e-41f7-b738-6028d5edd3c6" />


## Project Highlights

* Customer & Admin Workflows : Separate authenticated experiences designed around different user roles and responsibilities.
* Project Management : Customer project requests alongside administrative project and content management workflows.
* Real-Time Communication : Live chat using Supabase Realtime with structured conversations and message handling.
* Secure Media Handling : Cloudinary integration with server-side signing and project-message media support.
* Database-Backed Architecture : Supabase/PostgreSQL with version-controlled migrations and Row Level Security.
* Server-Side APIs : API functionality for contact submissions, email delivery and Cloudinary operations.
* Maintainable Frontend Architecture : Feature-based organisation, reusable components, shared services and a dedicated design system.


## Key Features

### Customer Experience

* Customer registration and sign-in
* Protected customer routes
* Customer dashboard
* Customer account area
* Project request workflows
* Customer project-request management
* Customer-facing application functionality
* Live chat

### Administration

* Protected admin authentication
* Administrative dashboard
* Project management
* Project request management
* Services management
* Pricing management
* Team management
* Contact-submission management
* Administrative live-chat access
* Reusable administrative interface components
* Search, filtering, loading and error states

### Live Chat

* Visitor profile capture
* Conversation management
* Structured conversation flows
* Real-time messaging
* Supabase Realtime subscriptions
* Visitor and customer messaging functionality
* Chat message composition
* Message previews
* Typing indicators
* Chat feedback and conversation states
* Project-message media support

### Media Management

The application uses Cloudinary for application media.

Current media functionality includes:

* Image uploads
* Video uploads
* Project-message attachments
* Cloudinary signed operations
* Media deletion
* Cloudinary folder management
* Project-message media management

Server-side Cloudinary operations are handled through the application's API layer rather than exposing Cloudinary secrets to the browser.

### Contact Form

The contact system currently:

1. Receives contact-form submissions through the server-side API.
2. Validates the submitted information.
3. Stores the submission in Supabase.
4. Sends an email notification using Nodemailer.

Contact submissions are also available to the administrative side of the application.

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Lucide React
* React Icons

### Backend & Data

* Supabase
* PostgreSQL
* Supabase Authentication
* Supabase Realtime
* Server-side API endpoints
* Cloudinary
* Nodemailer

### Development

* TypeScript
* JavaScript
* Git
* GitHub
* VS Code
* ESLint
* Vite

## Application Architecture

The application is organised around features and shared functionality.

```text
React-Version/
│
├── api/
│   ├── cloudinary/
│   └── contact.js
│
├── src/
│   ├── design-system/
│   │   ├── components/
│   │   └── tokens/
│   │
│   ├── features/
│   │   ├── admin/
│   │   ├── customer/
│   │   ├── live-chat/
│   │   └── pages/
│   │
│   ├── layouts/
│   ├── lib/
│   ├── routes/
│   └── shared/
│
├── supabase/
│   └── migrations/
│
├── public/
├── package.json
└── vite.config.ts
```

### Feature-Based Organisation

The main application functionality is separated into feature areas.

```text
src/features/
├── admin/
├── customer/
├── live-chat/
└── pages/
```

This keeps related functionality together and helps prevent large page files from containing unrelated business logic.

### Shared Functionality

Common functionality is separated from individual features.

```text
src/shared/
├── components/
├── hooks/
├── services/
├── types/
└── utils/
```

This allows functionality that is used by multiple parts of the application to remain reusable and easier to maintain.

### Design System

The project contains a dedicated design-system layer.

```text
src/design-system/
├── components/
└── tokens/
```

The design system contains reusable interface components and design tokens for areas such as:

* Colours
* Typography
* Spacing
* Radius
* Shadows
* Motion
* Buttons
* Cards
* Badges
* Labels
* Typography components
* Section headers
* Hero components

The purpose is to keep the interface consistent and make shared UI patterns easier to maintain.

## Authentication & Access Control

The current application uses Supabase Authentication for customer and administrative authentication.

Protected routes are used to restrict access to authenticated areas.

The project also includes database-level Row Level Security policies through Supabase migrations.

Examples include access controls for:

* Customer profiles
* Project requests
* Live-chat conversations
* Messages
* Projects
* Services
* Pricing
* Team data
* Contact submissions
* Project-message media

## Database & Migrations

Supabase provides the application's database and authentication infrastructure.

Database changes are tracked through migration files:

```text
supabase/migrations/
```

The current migration history covers areas including:

* Live-chat foundation
* Admin dashboard
* Admin chat access
* Live-chat onboarding
* Offline chat flow
* Contact submissions
* Admin security hardening
* Projects CMS
* Services CMS
* Pricing CMS
* Team CMS
* Customer authentication
* Project requests
* Cloudinary media
* Project-message media

Using migrations keeps database changes version-controlled alongside the application code.

## Row Level Security

The application uses Supabase Row Level Security to control access to database records.

Policies distinguish between different application roles and ownership contexts.

For example, the database contains policies allowing customers to access their own project requests while allowing authorised administrators to manage project requests.

Similar access-control policies are used across customer profiles, conversations, messages, services, pricing, team data and project-message media.

The security model continues to be reviewed and improved as the application develops.

## Real-Time Functionality

The live-chat system uses Supabase Realtime for message updates.

The application contains dedicated services and hooks for:

* Realtime connections
* Message subscriptions
* Conversation handling
* Message sending
* Visitor management
* Conversation state
* Chat UI state

This keeps the real-time communication logic separated from the presentation layer.

## API & Server-Side Operations

The `api` directory contains server-side functionality that should not run directly in the browser.

### Contact API

`api/contact.js` handles contact-form submissions.

It:

* validates incoming data
* stores submissions in Supabase
* sends notification emails through Nodemailer
* uses server-side environment variables for sensitive credentials

### Cloudinary API

The `api/cloudinary/` directory contains server-side Cloudinary operations.

These include:

* Signed upload functionality
* Media deletion
* Project-message media operations
* Folder operations
* Cloudinary API authentication

Sensitive Cloudinary credentials remain server-side.

## Media Architecture

The application separates media-related UI, services and server-side operations.

```text
Frontend
   │
   ├── CloudinaryImageUpload
   ├── CloudinaryVideoUpload
   └── ProjectMessageAttachmentPicker
             │
             ▼
       Shared upload services
             │
             ▼
        Server-side API
             │
             ▼
          Cloudinary
```

Project-message media is also represented in the Supabase database so that media can be associated with application records and conversations.

## Development Practices

During development, the project has focused on:

* Feature-based organisation
* Separation of customer and administrative functionality
* Reusable components
* Shared services and utilities
* TypeScript for stronger type checking
* Server-side handling of sensitive credentials
* Database migrations
* Row Level Security
* Real-time data subscriptions
* Git-based version control
* ESLint-based code-quality checks
* Separation of UI, services, hooks and data-related logic
* Iterative architectural improvements as the application grows

## Local Development

### Prerequisites

* Node.js
* npm
* Supabase project
* Cloudinary account
* Email service compatible with Nodemailer

### Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/HoussamLh/React-Version.git
cd React-Version
```

Install dependencies:

```bash
npm install
```

Create a local environment file based on `.env.example`.

Configure the required Supabase, Cloudinary and email environment variables.

Start the development server:

```bash
npm run dev
```

For local development with Vercel's runtime:

```bash
npm run dev:vercel
```

### Available Scripts

Start the Vite development server:

```bash
npm run dev
```

Start the Vercel development environment:

```bash
npm run dev:vercel
```

Build the application:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Environment Variables

The project uses environment variables for external services and sensitive configuration.

Current configuration includes:

* Supabase client configuration
* Supabase server configuration
* Cloudinary configuration
* Email configuration

Sensitive credentials should never be committed to the repository.

Use `.env.local` for local development and configure production secrets through the deployment environment.

## Project Status

React-Version is an actively developed software project.

The application continues to evolve as new requirements are identified and existing functionality is refined.

Current development focuses on improving:

* Application architecture
* Security
* Maintainability
* Customer experience
* Administrative workflows
* Real-time communication
* Data management
* Production readiness

## What This Project Demonstrates

This project provides practical experience across several areas of software development:

* Full-stack web application development
* React and TypeScript
* Software architecture
* Feature-based organisation
* Authentication
* Role-based access patterns
* Database design
* PostgreSQL
* Supabase
* Row Level Security
* Real-time applications
* API development
* Cloudinary media management
* Email integration
* Reusable component design
* Design systems
* Git and GitHub
* Debugging and iterative problem solving

## Future Development

Planned improvements include further work on:

* Production-grade email delivery
* Customer account experience
* Design-system refinement
* Light and dark themes
* Live-chat improvements
* Payment processing
* Subscription functionality
* Authentication improvements
* Security and Row Level Security auditing
* Further architectural and scalability improvements

These features are planned development work and are not currently represented as completed functionality.


## Repository

The source code is available on GitHub:

**HoussamLh / React-Version**

## Author

**Houssam Lahlah**

Software Developer focused on building maintainable software systems, full-stack applications, data-driven functionality, and practical solutions to real-world problems.
