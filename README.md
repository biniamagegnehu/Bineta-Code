# BINETA CODE

A React/Vite portfolio and Express/MySQL API. The public projects, profile, contact form, and admin dashboard use the API; no demo records are substituted when the database is unavailable.

## Requirements

- Node.js 20.19+ or 22.12+
- MySQL 8+

## Run locally

1. Create a MySQL database user and database named `bineta_code`. Keep credentials private.
2. In `backend`, copy `.env.example` to `.env`, then set the MySQL credentials, a long random `JWT_SECRET`, the allowed frontend origin, and the admin bootstrap credentials.
3. In a terminal:

   ```powershell
   cd "D:\html,css and javascript\Bineta Code\backend"
   npm install
   npm run db:init
   npm run admin:create
   npm run dev
   ```

4. In a second terminal:

   ```powershell
   cd "D:\html,css and javascript\Bineta Code\frontend"
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```

5. Open the Vite URL (normally `http://localhost:5173`). Admin login is at `/admin/login`; it uses the username and password configured for `npm run admin:create`. Before sharing the site, replace the sample email/social links in **Admin → Settings** and add your profile photo and projects.

The backend defaults to `http://localhost:4000`. Configure `VITE_API_URL` if it differs. Uploaded project images are stored under `backend/uploads`; back them up or use persistent storage when hosting. Do not deploy until the database, CORS origin, secrets, and upload persistence are configured for the host.
