# Sheetal Shivalaya Samiti - Hostinger Deployment Guide

This package contains the full source code and production-ready configuration for deploying the Sheetal Shivalaya Samiti website to Hostinger Node.js hosting.

## Prerequisites

1.  **Node.js**: Ensure Node.js (v18 or later) is installed on your Hostinger account.
2.  **Supabase**: Have your Supabase Project URL and Anon Key ready.

## Deployment Steps on Hostinger

1.  **Upload Files**: Upload the contents of this ZIP to your Hostinger project directory.
2.  **Environment Variables**:
    *   Create a `.env` file in the root directory (based on `.env.example`).
    *   Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3.  **Install Dependencies**:
    *   Open the Hostinger Terminal or use the Node.js selector.
    *   Run: `npm install`
4.  **Build the Project**:
    *   Run: `NITRO_PRESET=node-server npm run build`
    *   This will generate a `.output` directory containing the Node.js server.
5.  **Start the Server**:
    *   Configure your Hostinger Node.js application to use `.output/server/index.mjs` as the entry point.
    *   Or run: `node .output/server/index.mjs`

## Environment Variables (.env)

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Support

Designed & Developed by **PAWANPRABHA INFOTECH**
WhatsApp: +91 6262013335
