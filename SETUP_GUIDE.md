# 🔧 Complete Setup Guide

## Prerequisites

Before you start, ensure you have installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Docker** (optional, for PostgreSQL) - [Download](https://www.docker.com/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/delaacademics/pharms.git
cd pharms
```

### Step 2: Configure Environment Variables

**Backend Setup:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update the values if needed:
- `DATABASE_URL` - Your database connection string
- `JWT_SECRET` - Change this to a secure random string

**Frontend Setup:**
```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local` and ensure:
- `NEXT_PUBLIC_API_URL` matches your backend URL

### Step 3: Set Up the Database

**Option A: Using Docker (PostgreSQL) - Recommended**

```bash
# From the project root directory
docker-compose up -d

# Wait a few seconds for the container to start, then run migrations
cd backend
npx prisma migrate dev --name init
cd ..
```

**Option B: Using SQLite (Local Development)**

Edit `backend/.env` and uncomment the SQLite line:
```
DATABASE_URL="file:./dev.db"
```

Then run migrations:
```bash
cd backend
npx prisma migrate dev --name init
cd ..
```

### Step 4: Install Dependencies

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Step 5: Start the Application

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Or manually:**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Step 6: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Default Test Accounts

After running migrations, you can use these test accounts (if seed data is available):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Nurse | nurse@hospital.com | nurse123 |
| Pharmacist | pharmacist@hospital.com | pharmacist123 |
| Finance | finance@hospital.com | finance123 |
| Patient | patient@hospital.com | patient123 |

*Note: Check your database seed file for actual test credentials.*

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Find process using port 3000 (macOS/Linux)
lsof -i :3000
# Or on Windows
netstat -ano | findstr :3000

# Kill the process
# macOS/Linux: kill -9 <PID>
# Windows: taskkill /PID <PID> /F
```

### Database Connection Error

1. **Check Docker container:**
   ```bash
   docker ps
   ```
   Ensure the PostgreSQL container is running.

2. **Verify DATABASE_URL:**
   - Ensure the connection string in `backend/.env` is correct
   - Default: `postgresql://admin:adminpassword@localhost:5432/hospital_db?schema=public`

3. **Reset database:**
   ```bash
   cd backend
   npx prisma migrate reset
   ```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend Not Connecting to Backend

1. Ensure backend is running on port 5000
2. Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
3. Clear frontend cache: `rm -rf frontend/.next`
4. Restart frontend development server

## Running on Different Machines

### Docker Setup

To containerize the entire application:

1. Build the images:
   ```bash
   docker-compose up -d
   ```

2. Run database migrations:
   ```bash
   docker exec -it pharms-db-1 npx prisma migrate deploy
   ```

### Deployment

For production deployment, follow the [Next.js deployment guide](https://nextjs.org/docs/deployment) and configure your Express backend accordingly.

## Need Help?

- Check existing [Issues](https://github.com/delaacademics/pharms/issues)
- Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- See [CONTRIBUTING.md](CONTRIBUTING.md)
- Create a new issue with details about your problem
