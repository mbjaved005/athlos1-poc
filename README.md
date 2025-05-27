# Athlos1 Admin Portal (POC)

## Overview
A web-based admin interface for Athlos1, designed for secure and scalable user management and onboarding. Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Lucide-react.

## Key Features
- Authentication (NextAuth.js/Auth.js, JWT, MongoDB adapter)
- User management, onboarding, activity monitoring
- Modular, accessible UI (WCAG 2.1 AA)
- Responsive, mobile-first design
- Branding: ATHLOS ONE logo, language selector

## Tech Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- shadcn/ui
- Lucide-react
- Node.js API routes
- MongoDB Atlas

## Reference Flows
For step-by-step UI flows and JSX samples, see the `reference-data` folder in the root of this repository.

---

## Development
- Run `npm install` to install dependencies
- Run `npm run dev` to start the development server

## Best Practices
- All interactive elements are accessible and keyboard navigable
- Proper ARIA labels and semantic HTML
- Secure authentication and session management
- Modular, reusable components

For detailed guidelines, see `reference-data/best_practices.md`.