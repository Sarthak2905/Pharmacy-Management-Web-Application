# Pharmacy Management Web Application

A monorepo-style MERN starter for a beginner-friendly, SaaS-ready pharmacy management system built with **MongoDB, Express, React, Node.js, Redux Toolkit, Tailwind CSS, and JWT auth**.

## What this repository now includes

- Modern **React + Vite** admin client with protected routes and dashboard layout
- Professional **Express + Mongoose** backend split into routes, controllers, services, models, middlewares, validators, and jobs
- Core Phase 1 backend modules for:
  - authentication
  - medicines and categories
  - inventory movements
  - customer management
  - billing and invoice rendering
  - dashboard stats
  - reports and notifications
- SaaS-ready structure for future multi-store support
- `.env.example` and `docker-compose.yml` for local development

## Folder structure

```text
.
├── client
│   ├── public
│   └── src
│       ├── api
│       ├── app
│       ├── components
│       │   ├── billing
│       │   ├── charts
│       │   ├── common
│       │   ├── forms
│       │   ├── layout
│       │   └── tables
│       ├── constants
│       ├── features
│       │   ├── auth
│       │   ├── billing
│       │   ├── customers
│       │   ├── dashboard
│       │   ├── inventory
│       │   ├── medicines
│       │   ├── reports
│       │   └── settings
│       ├── pages
│       ├── routes
│       └── utils
├── server
│   └── src
│       ├── config
│       ├── controllers
│       ├── jobs
│       ├── middlewares
│       ├── models
│       ├── routes
│       ├── services
│       ├── utils
│       └── validators
├── .env.example
├── docker-compose.yml
└── README.md
```

## Backend architecture

- **Routes** define endpoints only.
- **Controllers** translate HTTP requests into service calls.
- **Services** contain reusable business logic like billing math and stock updates.
- **Models** define MongoDB schemas and indexes.
- **Middlewares** handle auth, roles, validation, and errors.
- **Jobs** support expiry alerts and future scheduled reminders.

## MongoDB schemas

### User
- name
- email
- phone
- passwordHash
- role: `admin | staff | cashier | manager`
- isActive
- lastLogin
- refreshTokenHash
- timestamps

### Category
- name
- description
- isActive
- timestamps

### Medicine
- name
- genericName
- brandName
- categoryId
- manufacturer
- batchNumber
- barcode
- expiryDate
- purchasePrice
- sellingPrice
- mrp
- gstRate
- stockQuantity
- reorderLevel
- unitType
- locationInStore
- isActive
- createdBy
- timestamps

### Customer
- name
- phone
- email
- address
- gender
- dateOfBirth
- notes
- outstandingDue
- totalPurchases
- timestamps

### Bill
- billNumber
- customerId
- cashierId
- items[] with immutable medicine snapshots
- subtotal
- totalTax
- discountAmount
- grandTotal
- paymentMethod
- paymentStatus
- amountPaid
- amountDue
- invoicePdfUrl
- printedAt
- timestamps

### StockMovement
- medicineId
- type
- quantityChange
- quantityBefore
- quantityAfter
- referenceType
- referenceId
- notes
- createdBy
- timestamps

### Notification
- type
- title
- message
- medicineId / customerId
- isRead
- timestamps

### Store
- name
- ownerName
- subscriptionPlan
- address
- gstNumber
- contactEmail
- status

## REST API surface

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/refresh`
- `POST /api/auth/register-staff`

### Users / roles
- `GET /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/status`

### Categories
- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/:id`
- `DELETE /api/categories/:id`

### Medicines
- `GET /api/medicines`
- `GET /api/medicines/:id`
- `POST /api/medicines`
- `PATCH /api/medicines/:id`
- `DELETE /api/medicines/:id`
- `GET /api/medicines/search?q=`
- `GET /api/medicines/low-stock`
- `GET /api/medicines/expiring?days=7`

### Inventory
- `GET /api/inventory/summary`
- `GET /api/inventory/movements`
- `POST /api/inventory/adjustments`
- `POST /api/inventory/restock`

### Billing
- `POST /api/bills`
- `GET /api/bills`
- `GET /api/bills/:id`
- `GET /api/bills/:id/invoice`
- `GET /api/bills/:id/pdf`
- `POST /api/bills/:id/print`
- `POST /api/bills/:id/send-whatsapp`

### Customers
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/customers/:id`
- `PATCH /api/customers/:id`
- `GET /api/customers/:id/bills`
- `GET /api/customers/search?q=`
- `POST /api/customers/:id/pay-due`

### Dashboard, reports, notifications
- `GET /api/dashboard/stats`
- `GET /api/dashboard/recent-bills`
- `GET /api/dashboard/revenue-today`
- `GET /api/dashboard/alerts`
- `GET /api/reports/daily-sales`
- `GET /api/reports/monthly-sales`
- `GET /api/reports/top-selling-medicines`
- `GET /api/reports/revenue-analytics`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`

## Authentication flow

1. User logs in with email and password.
2. Backend verifies bcrypt-hashed credentials.
3. Backend returns an access token and refresh token.
4. Frontend stores the tokens and attaches the access token through Axios.
5. Protected routes render only when an access token exists.
6. RoleRoute restricts admin-only or manager-only screens.
7. When a 401 happens, Axios attempts token refresh automatically.
8. Logout removes saved credentials and clears the stored refresh token hash on the server.

## Billing calculation logic

For each line item:
- `lineSubtotal = quantity × sellingPrice`
- `lineTax = lineSubtotal × gstRate / 100`
- `lineTotal = lineSubtotal + lineTax`

For the bill:
- `subtotal = sum(lineSubtotal)`
- `totalTax = sum(lineTax)`
- `grandTotal = subtotal + totalTax - discountAmount`
- `amountDue = grandTotal - amountPaid`

The backend recalculates every total itself so the client cannot tamper with billing numbers.

## Invoice generation flow

- Bills store medicine name, batch number, unit price, GST, and totals as snapshots.
- `/api/bills/:id/invoice` renders printable HTML.
- `/api/bills/:id/pdf` currently returns downloadable invoice markup as a starter implementation.
- You can replace the helper in `server/src/utils/invoicePdf.js` with Puppeteer or PDFKit later for true PDF output.

## Automatic stock updates after sales

The billing service:
1. validates stock before confirming the bill,
2. deducts sold quantity from each medicine,
3. creates a `StockMovement` record for every sold item,
4. updates customer purchase totals and dues when a customer is linked.

This keeps billing and inventory aligned in the service layer instead of route handlers.

## Frontend pages included

- Login page
- Dashboard
- Medicines list
- Add medicine
- Edit medicine
- Inventory
- Billing / POS
- Bill details
- Customers
- Customer profile
- Reports
- Settings
- 404 page

## Beginner-friendly development roadmap

1. Start MongoDB and the Express API.
2. Seed the default admin automatically by starting the server once.
3. Log in from the client with:
   - email: `admin@pharmacy.local`
   - password: `Admin@123`
4. Connect each placeholder page to its API routes.
5. Add forms for medicine CRUD, customer CRUD, and bill creation.
6. Replace invoice HTML downloads with real PDF generation.
7. Add expiry notifications, barcode scanning, and WhatsApp automation in later phases.

## Best practices already reflected

- clear MVC/service split
- reusable frontend layout and table components
- backend-side billing validation
- role-aware routes
- immutable invoice snapshots
- stock audit trail through `StockMovement`
- responsive layout and dark/light theme toggle
- SaaS-ready `Store` model for future multi-tenancy

## Local setup

### Option 1: normal local run

```bash
npm install
cd server && npm install
cd ../client && npm install
```

Start MongoDB locally, then run:

```bash
npm run dev:server
npm run dev:client
```

### Option 2: Docker Compose

```bash
docker compose up
```

## Validation commands

```bash
npm run build
npm run lint
npm run check:server
```

## Deployment guide

### Frontend
- Deploy the `client` app to Vercel or Netlify.
- Set `VITE_API_BASE_URL` to your deployed backend URL.

### Backend
- Deploy the `server` app to Render, Railway, or Fly.io.
- Configure:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `CLIENT_URL`

### Database
- Use MongoDB Atlas for production.
- Enable database backups and IP/network restrictions.

## SaaS conversion ideas

- add `storeId` to business collections for multi-tenant isolation
- create Starter, Growth, and Pro plans
- bill by number of staff, stores, or invoices
- offer WhatsApp, barcode, and advanced analytics as paid add-ons
- create a central owner dashboard for chain pharmacies

## Resume-worthy talking points

- Full-stack MERN SaaS starter with JWT auth and role-based access control
- Scalable Express service architecture with billing, inventory, and reporting modules
- Inventory-aware billing flow with automatic stock deduction and audit logs
- Responsive React admin dashboard using Redux Toolkit, Tailwind CSS, and reusable components
- SaaS-ready domain modeling for future multi-store growth
