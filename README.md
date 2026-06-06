# Hospital Administration & Patient Portal

A comprehensive, full-stack Hospital Administration and Patient Management Portal. It integrates medical scheduling, prescription workflows, pharmacy stock management, billing invoices, and lab test results into a unified dashboard with role-based access control.

---

## 🚀 System Architecture

- **Frontend**: Next.js (App Router, TypeScript, TailwindCSS, Lucide Icons, Axios)
- **Backend**: Node.js & Express (TypeScript, JSON Web Tokens (JWT), Bcrypt password hashing)
- **Database / ORM**: Prisma ORM with support for PostgreSQL (via Docker Compose) and SQLite (for development)

---

## 🔑 Key Features

### 👥 Role-Based Access Control (RBAC)
Dedicated user accounts and specialized dashboard panels for:
- **Administrators**: Full system control and access to revenue analytics.
- **Doctors**: Manage appointments, issue prescriptions, and order lab tests.
- **Nurses**: Patient registration, vital checks, and appointment creation.
- **Pharmacists**: Add/manage drug stock, track expiration dates, and view pending prescriptions.
- **Finance / Cashier**: Review invoices and process/confirm bill payments.
- **Patients**: Self-registration portal, appointment booking with real-time doctor availability slots, and access to lab results.

### 📅 Appointment Scheduling
- Patients can choose their doctor, pick a date, and view available hourly slots (automatically filtered by the doctor's existing appointments and working hours).
- Nurses and Doctors can schedule appointments directly for patients.

### 💊 Pharmacy & Prescription Workflows
- Doctors create digital prescriptions with specific drug quantities and dosages.
- Submitting a prescription **automatically deducts** the items from the pharmacy's real-time drug inventory.
- Prescriptions **automatically generate** an invoice in the billing system based on the drug unit prices.

### 💳 Billing & Invoicing
- Tracks invoice status (e.g. `PENDING`, `PAID`).
- Finance users can view generated invoices and process payments with a single click.

### 🔬 Laboratory Module
- Doctors and Nurses can order lab tests (e.g., blood tests, imaging).
- Record test results and add clinical notes.
- Patients can view their lab reports securely from their personal dashboard.

### 📊 Admin Analytics Dashboard
- Total registered patients counter.
- Today's appointment counter.
- Pharmacy low-stock warning indicators (alerts when drug stock is under 50 units).
- Monthly billing revenue calculations.

---

## 📂 Project Structure

```
pharms/
├── frontend/             # Next.js Frontend Application
│   ├── src/app/          # Page router / views (login, dashboard, patient portal)
│   ├── src/context/      # React contexts (Authentication State)
│   └── package.json
├── backend/              # Node.js Express Backend API
│   ├── prisma/           # Prisma DB schema & seed scripts
│   ├── index.ts          # Core API endpoints & logic
│   └── package.json
├── docker-compose.yml    # PostgreSQL Container Config
└── start.bat             # Combined Windows startup script
```

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) (optional, for PostgreSQL DB container)

### Step 1: Clone & Configure
1. Clone this repository to your local machine.
2. In the `backend` folder, copy the environment file and configure your settings:
   - Configure your Database Connection URL and `JWT_SECRET`.

### Step 2: Database Setup
You can use Postgres via Docker:
```bash
docker-compose up -d
```
Then run migrations to set up the schemas:
```bash
cd backend
npx prisma migrate dev
```

### Step 3: Run the Application
You can run both servers concurrently using the Windows startup script:
1. Double-click `start.bat` in the root folder.

Alternatively, launch them manually:
* **Backend**:
  ```bash
  cd backend
  npm install
  npm run dev
  ```
* **Frontend**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

* Access the portal at: **`http://localhost:3000`**
* Backend API documentation / server runs on: **`http://localhost:5000`**
