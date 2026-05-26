# RENTACAR (Rent-a-Ride)

RENTACAR is a full-stack car rental platform with three roles (User, Vendor, Admin). The project is split into a React (Vite) client and an Express + MongoDB backend.

## What You Get

### User Module

- Browse the fleet, search, sort, and filter vehicles
- View vehicle details and availability
- Book vehicles and view booking history
- Profile management
- Booking confirmation email
- Payments: Razorpay and Stripe

### Vendor Module

- Vendor signup/signin (separate flow from users)
- Add/edit/delete vehicles (with media uploads)
- View vendor bookings

### Admin Module

- Admin dashboard and platform management
- Add/edit/delete vehicles
- Approve/reject vendor vehicle requests
- View and manage users, vendors, and bookings
- Seed/location master data endpoints (admin-only)

## Tech Stack

- Frontend: React (Vite), Redux Toolkit, Tailwind CSS, Material UI, React Hook Form, Zod
- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT (access + refresh), Multer, Nodemailer, Cloudinary
- Payments: Razorpay + Stripe (Stripe supports a mock/dev mode)

## Repository Layout

```text
RENTACAR/
  backend/                 Express API + MongoDB models/routes/controllers
  client/                  React (Vite) web app
  package.json             Backend dependencies + backend scripts (root-level)
  vercel.json              Frontend deployment rewrites (/api -> hosted backend)
```

Important: backend dependencies are installed from the repository root (there is no `backend/package.json`).

## Local Setup

### Prerequisites

- Node.js (recommended: latest LTS)
- MongoDB (local or Atlas)

### 1) Clone

```bash
git clone https://github.com/ARXNDEV/RENTACAR.git
cd RENTACAR
```

### 2) Backend

Install backend dependencies (from repo root):

```bash
npm install
```

Create `backend/.env` (required):

```bash
PORT=3000
mongo_uri=mongodb://127.0.0.1:27017/rentacar

ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret

CLIENT_URL=http://localhost:5173
NODE_ENV=development

CLOUD_NAME=placeholder
API_KEY=placeholder
API_SECRET=placeholder

EMAIL_HOST=placeholder
EMAIL_PASSWORD=placeholder

RAZORPAY_KEY_ID=placeholder
RAZORPAY_SECRET=placeholder

STRIPE_SECRET_KEY=mock_stripe_key_for_dev
STRIPE_WEBHOOK_SECRET=placeholder
```

Run backend:

```bash
npm run dev
```

Backend URL: `http://localhost:3000`

### 3) Frontend

Install frontend dependencies:

```bash
cd client
npm install
```

Create `client/.env`:

```bash
VITE_PRODUCTION_BACKEND_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_public_key_id
```

Run frontend:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## Auth + Tokens

- The backend uses JWT access/refresh tokens.
- Some protected APIs expect `Authorization` in this format:

```text
Authorization: Bearer <refreshToken>,<accessToken>
```

## Seed Data (Development)

### Default Accounts

On first successful DB connection, the backend seeds:
- Admin: `admin@rentaride.com` / `admin123`
- User: `user@rentaride.com` / `user123`

### Seed Vehicles

After setting `mongo_uri` in `backend/.env`:

```bash
node backend/seed.js
```

## API (Selected Endpoints)

Base URL: `http://localhost:3000/api`

- Auth (`/api/auth`)
  - `POST /signup`
  - `POST /signin`
  - `POST /google`
  - `POST /refreshToken`
- User (`/api/user`)
  - `GET /listAllVehicles`
  - `POST /showVehicleDetails`
  - `POST /searchCar`
  - `POST /checkAvailability`
  - `POST /bookCar`
  - `POST /razorpay`
  - `POST /create-checkout-session`
  - `POST /create-payment-intent`
- Admin (`/api/admin`)
  - `GET /showVehicles`
  - `POST /addProduct`
  - `PUT /editVehicle/:id`
  - `DELETE /deleteVehicle/:id`
  - `GET /allUsers`
  - `GET /allVendors`
  - `GET /allBookings`
- Vendor (`/api/vendor`)
  - `POST /vendorsignup`
  - `POST /vendorsignin`
  - `POST /vendorAddVehicle`
  - `POST /showVendorVehilces`
  - `POST /vendorBookings`

## Scripts

From repository root:

```bash
npm run dev
npm run start
```

From `client/`:

```bash
npm run dev
npm run build
npm run preview
```

## Deployment Notes

- `vercel.json` proxies `/api/*` to a hosted backend URL.
- Typical production setup:
  - Deploy `client/` to Vercel (or similar)
  - Deploy `backend/` to Render / EC2 / any Node hosting
- If you change the frontend domain/port, update backend CORS origins in `backend/server.js`.

## Troubleshooting

- MongoDB not connecting: verify `mongo_uri` and Atlas network allowlist (if using Atlas)
- CORS errors: add your frontend origin to `allowedOrigins` in `backend/server.js`
- Google OAuth errors: verify `VITE_GOOGLE_CLIENT_ID` and authorized origins in Google console
- Stripe webhook: needs a public URL + correct `STRIPE_WEBHOOK_SECRET`

## Screenshots

### User
<img width="1440" alt="Screenshot 2024-04-06 at 3 06 32 PM" src="https://github.com/user-attachments/assets/4b769f7d-5d2c-43a7-8283-07fa8402de92">
<img width="1430" alt="Screenshot 2024-12-10 at 12 35 41 AM" src="https://github.com/user-attachments/assets/5d6e0160-5f1d-4e67-a64e-1e18fb17a590">
<img width="1425" alt="Screenshot 2024-12-10 at 12 35 58 AM" src="https://github.com/user-attachments/assets/ac6b0f33-344e-4009-a979-23ea7dc3a5bb">
<img width="1430" alt="Screenshot 2024-12-10 at 12 36 15 AM" src="https://github.com/user-attachments/assets/40e2dc7d-0694-483d-bf4a-badac9c4d5f3">
<img width="1426" alt="Screenshot 2024-12-10 at 12 36 28 AM" src="https://github.com/user-attachments/assets/7ce5d1fa-c51f-414b-92da-cc04ac7c3402">
<img width="1428" alt="Screenshot 2024-12-10 at 1 59 45 AM" src="https://github.com/user-attachments/assets/0e87009c-832d-4c5e-be7c-ecd4df341070">
<img width="1408" alt="Screenshot 2024-12-10 at 2 00 01 AM" src="https://github.com/user-attachments/assets/baf15b5d-2e04-4410-803b-527dddda1aab">

### Admin
<img width="1418" alt="Screenshot 2024-12-10 at 2 01 09 AM" src="https://github.com/user-attachments/assets/c08e3bf0-2776-4236-80b6-6714d52ec8d7">
<img width="1421" alt="Screenshot 2024-12-10 at 2 04 29 AM" src="https://github.com/user-attachments/assets/ce6dada8-41b7-4aec-b86a-4a359f6d339f">
<img width="1431" alt="Screenshot 2024-12-10 at 2 04 42 AM" src="https://github.com/user-attachments/assets/467503a4-ab9a-4396-bc57-1abff5fe8106">
<img width="1418" alt="Screenshot 2024-12-10 at 2 05 02 AM" src="https://github.com/user-attachments/assets/8e1d2948-6316-420b-8336-30ec7c752b04">

### Vendor
<img width="1418" alt="Screenshot 2024-12-10 at 2 05 02 AM" src="https://github.com/user-attachments/assets/59a9a9c7-5dc1-4f61-8d15-43266579386c">
<img width="1432" alt="Screenshot 2024-12-10 at 2 08 00 AM" src="https://github.com/user-attachments/assets/4e9d8f66-0984-4163-8dea-f9023db56ce0">
