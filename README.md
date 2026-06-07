# Hospital Administration & Patient Portal

A comprehensive, full-stack Hospital Administration and Patient Management Portal. It integrates medical scheduling, prescription workflows, pharmacy stock management, billing invoices, and lab tests.

---

## 🚀 Quick Start

**First time setting up?** Follow the [Complete Setup Guide](SETUP_GUIDE.md) for detailed instructions.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (optional, for PostgreSQL)

### 5-Minute Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/delaacademics/pharms.git
   cd pharms
   ```

2. **Configure environment files:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

3. **Start the database (Docker):**
   ```bash
   docker-compose up -d
   ```

4. **Run both servers:**
   - **Windows:** Double-click `start.bat`
   - **Mac/Linux:** `chmod +x start.sh && ./start.sh`
   - **Manual:** Open 2 terminals and run:
     ```bash
     # Terminal 1: Backend
     cd backend && npm install && npm run dev
     
     # Terminal 2: Frontend
     cd frontend && npm install && npm run dev
     ```

5. **Access the app:**
   - Frontend: **http://localhost:3000**
   - Backend: **http://localhost:5000**

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
├── frontend/                   # Next.js Frontend Application
│   ├── src/app/                # Pages and routes
│   ├── src/components/         # Reusable React components
│   ├── src/context/            # React context (Auth state)
│   ├── .env.example            # Environment variables template
│   └── package.json
├── backend/                    # Node.js Express Backend API
│   ├── prisma/                 # Database schema & migrations
│   ├── src/                    # Backend source code
│   ├── index.ts                # Main server file
│   ├── .env.example            # Environment variables template
│   └── package.json
├── docker-compose.yml          # PostgreSQL container configuration
├── start.bat                   # Windows startup script
├── start.sh                    # Mac/Linux startup script
├── SETUP_GUIDE.md              # Detailed setup instructions
├── TROUBLESHOOTING.md          # Common issues & solutions
└── CONTRIBUTING.md             # Contribution guidelines
```

---

## 🛠️ System Architecture

- **Frontend**: Next.js (App Router, TypeScript, TailwindCSS, Lucide Icons, Axios)
- **Backend**: Node.js & Express (TypeScript, JSON Web Tokens (JWT), Bcrypt password hashing)
- **Database / ORM**: Prisma ORM with support for:
  - PostgreSQL (via Docker Compose) - Recommended for production
  - SQLite (for local development)

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Complete step-by-step setup guide for all operating systems |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Solutions for common issues and errors |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guidelines for contributing to the project |

---

## 🚦 Getting Started in Detail

### For First-Time Setup
Follow the [Complete Setup Guide](SETUP_GUIDE.md) which includes:
- Environment configuration
- Database setup (Docker or SQLite)
- Dependency installation
- Running the application
- Accessing test accounts

### For Troubleshooting
Check the [Troubleshooting Guide](TROUBLESHOOTING.md) for solutions to:
- Port conflicts
- Database connection issues
- Missing dependencies
- And more!

### For Contributing
Review [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development guidelines
- Code style conventions
- How to submit pull requests
- How to report issues

---

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hospital_db"
JWT_SECRET="your-secret-key"
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
PORT=3000
```

See `.env.example` files in each directory for templates.

---

## 🧪 Testing the Application

### Test Accounts (after database seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Nurse | nurse@hospital.com | nurse123 |
| Pharmacist | pharmacist@hospital.com | pharmacist123 |
| Finance | finance@hospital.com | finance123 |
| Patient | patient@hospital.com | patient123 |

*Note: Actual credentials depend on your database seed file.*

---

## 🐛 Common Issues

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

### Database Connection Error
1. Ensure Docker is running: `docker ps`
2. Start containers: `docker-compose up -d`
3. Wait 10-15 seconds for PostgreSQL to initialize

### Frontend Can't Connect to Backend
1. Verify backend is running at http://localhost:5000
2. Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
3. Restart frontend: `npm run dev`

**For more solutions, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

---

## 📱 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📝 License

This project is provided as-is. See LICENSE file for details (if applicable).

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests.

---

## 💬 Support & Questions

- **Issues:** [GitHub Issues](https://github.com/delaacademics/pharms/issues)
- **Discussions:** [GitHub Discussions](https://github.com/delaacademics/pharms/discussions)
- **Setup Help:** See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Errors?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**Last Updated:** June 2026  
**Status:** Active Development
