# Sheetal Shivalaya Samiti - Hostinger Deployment Guide

This package contains the full source code and production configuration for deploying the website to Hostinger.

## Deployment Type: Node.js (TanStack Start / Nitro)

The project is built on TanStack Start and requires a Node.js runtime for Server-Side Rendering (SSR) and Server Functions.

## Deployment Steps

1. **Upload & Extract**: Upload 'Sheetal-Shivalaya-Hostinger-Deployment.zip' to your Hostinger account and extract it into your project folder.
2. **Setup Node.js**: In Hostinger Panel, set up a Node.js application (Version 18+).
3. **Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your backend project.
4. **Install Dependencies**: Run `npm install` in the terminal.
5. **Build**: Run `npm run build:node` (this generates the `.output` folder).
6. **Entry Point**: Set the application entry point to `.output/server/index.mjs`.
7. **Start**: Start the application in the Hostinger panel.

## Supabase Integration
Supabase remains the external backend service. The application will connect to it using the environment variables provided. Ensure RLS policies and tables are correctly set up in the backend.

## Feature Testing
- **Public Website**: Visit your domain.
- **Admin Login**: Go to `/admin/login`.
- **YouTube Sync**: Check the frontend YouTube section to verify RSS sync.
- **WhatsApp**: Click the floating button to verify the pre-filled message.
