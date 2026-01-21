## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
cd CTF-Backend
npm install
```

3. Configure environment variables in `.env` file:

```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>

# Hosting / nginx
CORS_ORIGIN=https://play.miscspace.tech
PUBLIC_BASE_URL=https://play.miscspace.tech
COOKIE_SAMESITE=lax
NODE_ENV=production
```

4. Start the server:

```bash
npm run dev
```

## Production notes (nginx)

- If the frontend is served at `https://play.miscspace.tech`, set `CORS_ORIGIN=https://play.miscspace.tech`.
- Recommended nginx setup is:
	- Serve the built client (Vite `dist/`) at `/`
	- Proxy `/api/` to the backend (default `http://127.0.0.1:5000`)
	- Proxy `/docs` (optional) to the backend if you want Swagger UI public

For Swagger server URL in production, set `PUBLIC_BASE_URL=https://play.miscspace.tech`.



