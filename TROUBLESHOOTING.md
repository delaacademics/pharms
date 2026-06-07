# 🔍 Troubleshooting Guide

## Common Issues and Solutions

### 1. **Port Already in Use**

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

---

### 2. **Database Connection Failed**

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**

1. **Check if Docker is running:**
   ```bash
   docker ps
   ```

2. **Start PostgreSQL container:**
   ```bash
   docker-compose up -d
   ```

3. **Verify DATABASE_URL in `backend/.env`:**
   ```
   DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/hospital_db?schema=public"
   ```

4. **Wait 10-15 seconds** for the container to fully initialize before connecting.

---

### 3. **npm Dependencies Not Installing**

**Error:** `npm ERR! Cannot find module...`

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### 4. **Prisma Migration Issues**

**Error:** `PrismaClientInitializationError`

**Solution:**

```bash
cd backend

# Reset the database (WARNING: Deletes all data)
npx prisma migrate reset

# Or view migration status
npx prisma migrate status
```

---

### 5. **Frontend Cannot Connect to Backend**

**Error:** `Failed to fetch from localhost:5000`

**Solution:**

1. **Verify backend is running:**
   - Check if you can access http://localhost:5000 in your browser

2. **Check NEXT_PUBLIC_API_URL:**
   - Edit `frontend/.env.local`
   - Ensure: `NEXT_PUBLIC_API_URL=http://localhost:5000`

3. **Clear Next.js cache:**
   ```bash
   cd frontend
   rm -rf .next
   npm run dev
   ```

4. **Check CORS settings** in the backend if deployed remotely.

---

### 6. **"Cannot find module" Error**

**Error:** `Module not found: Can't resolve '@/...'`

**Solution:**

1. **Check TypeScript paths** in `tsconfig.json`
2. **Restart development server:**
   ```bash
   npm run dev
   ```
3. **Verify file paths** exist

---

### 7. **Build Failed During npm install**

**Error:** `Build failed during npm install`

**Solution:**

```bash
# Use compatible Node version
node --version  # Should be v18+

# Try installing with legacy peer deps
npm install --legacy-peer-deps
```

---

### 8. **Docker Container Won't Start**

**Error:** `Cannot connect to Docker daemon`

**Solution:**

1. **Ensure Docker is running:**
   - Windows/Mac: Open Docker Desktop
   - Linux: `sudo systemctl start docker`

2. **Check Docker logs:**
   ```bash
   docker logs pharms-db-1
   ```

3. **Rebuild container:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

---

### 9. **Login Issues / Authentication Errors**

**Error:** `Invalid credentials` or `User not found`

**Solution:**

1. **Verify database is seeded:**
   ```bash
   cd backend
   npx prisma db seed
   ```

2. **Check backend logs** for authentication errors

3. **Verify JWT_SECRET** in `backend/.env` is set

---

### 10. **Application Runs Slowly**

**Solution:**

1. **Check system resources:**
   - Ensure you have at least 2GB RAM available
   - Close unnecessary applications

2. **Check Docker resources:**
   - Docker Desktop settings → Resources
   - Allocate more CPU/RAM if needed

3. **Check for development tools:**
   - Close browser DevTools if not needed
   - Restart development servers

---

### 11. **.env File Not Found**

**Error:** `Error: ENOENT: no such file or directory, open '.env'`

**Solution:**

```bash
# Copy the example file
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit the files with your settings
```

---

### 12. **Database Migration Already Applied**

**Error:** `This migration has already been applied`

**Solution:**

```bash
cd backend

# Skip already applied migrations
npx prisma migrate deploy

# Or reset if needed
npx prisma migrate reset
```

---

### 13. **Prisma Studio Not Opening**

**Error:** Prisma Studio window doesn't open

**Solution:**

```bash
cd backend

# Start Prisma Studio
npx prisma studio

# Then open in browser: http://localhost:5555
```

---

## Useful Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Docker status
docker ps

# View Docker container logs
docker logs pharms-db-1

# Stop all Docker containers
docker-compose down

# View Prisma schema
cd backend
npx prisma studio

# Generate Prisma client
npx prisma generate

# Format Prisma schema
npx prisma format
```

---

## Performance Tips

1. **Close unnecessary browser tabs** to reduce resource usage
2. **Disable browser extensions** that might interfere with development
3. **Use SQLite for local development** if Docker runs slowly
4. **Increase Docker resources** if experiencing lag
5. **Clear browser cache** if experiencing stale data issues

---

## Still Having Issues?

1. **Check the [README.md](README.md)** for basic setup instructions
2. **Review [SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed setup steps
3. **Search existing issues** on GitHub
4. **Create a new issue** with:
   - Full error message (stack trace)
   - Operating system and Node.js version
   - Steps to reproduce
   - What you've already tried

---

**Last Updated:** June 2026
