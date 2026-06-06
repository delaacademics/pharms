import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";

// --- MIDDLEWARE ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const requireRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient role." });
    }
    next();
  };
};

// --- AUTH ROUTES ---
app.post("/api/auth/register", async (req: any, res: any) => {
  try {
    const { email, password, name, role, firstName, lastName, dob, gender, contact, address } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "NURSE";
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: userRole
      }
    });

    if (userRole === "PATIENT") {
      await prisma.patient.create({
        data: {
          userId: user.id,
          firstName: firstName || name.split(' ')[0],
          lastName: lastName || name.split(' ').slice(1).join(' '),
          dob: dob ? new Date(dob) : new Date(),
          gender: gender || 'Unknown',
          contact: contact || '',
          address: address || ''
        }
      });
    }

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- PATIENT ROUTES ---
app.get("/api/patients", authenticateToken, async (req: any, res: any) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

app.post("/api/patients", authenticateToken, requireRole(["ADMIN", "NURSE", "DOCTOR"]), async (req: any, res: any) => {
  try {
    const { firstName, lastName, dob, gender, contact, address, bloodGroup } = req.body;
    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        dob: new Date(dob),
        gender,
        contact,
        address,
        bloodGroup
      }
    });
    res.status(201).json(patient);
  } catch (error) {
    console.error("Patient Registration Error:", error);
    res.status(500).json({ error: "Failed to register patient" });
  }
});

// --- PHARMACY (DRUGS) ROUTES ---
app.get("/api/pharmacy/drugs", authenticateToken, async (req: any, res: any) => {
  try {
    const drugs = await prisma.drug.findMany({ orderBy: { name: 'asc' } });
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drugs" });
  }
});

app.post("/api/pharmacy/drugs", authenticateToken, requireRole(["ADMIN", "PHARMACIST"]), async (req: any, res: any) => {
  try {
    const { name, description, stock, price, expiryDate } = req.body;
    const drug = await prisma.drug.create({
      data: { name, description, stock: Number(stock), price: Number(price), expiryDate: expiryDate ? new Date(expiryDate) : null }
    });
    res.status(201).json(drug);
  } catch (error) {
    res.status(500).json({ error: "Failed to add drug" });
  }
});

// --- PRESCRIPTION ROUTES ---
app.post("/api/prescriptions", authenticateToken, requireRole(["ADMIN", "DOCTOR"]), async (req: any, res: any) => {
  try {
    const { patientId, notes, items } = req.body;
    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        doctorId: req.user.id,
        notes,
        items: { create: items.map((item: any) => ({ drugId: item.drugId, quantity: Number(item.quantity), dosage: item.dosage })) }
      },
      include: { items: { include: { drug: true } } }
    });
    
    // Create Invoice automatically
    let totalAmount = 0;
    for (const item of prescription.items) {
      totalAmount += item.quantity * item.drug.price;
    }
    
    await prisma.invoice.create({
      data: { patientId, prescriptionId: prescription.id, amount: totalAmount }
    });
    
    // Deduct stock
    for (const item of prescription.items) {
      await prisma.drug.update({
        where: { id: item.drugId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ error: "Failed to create prescription" });
  }
});

app.get("/api/prescriptions", authenticateToken, async (req: any, res: any) => {
  try {
    const prescriptions = await prisma.prescription.findMany({ include: { patient: true, doctor: true, items: { include: { drug: true } }, invoice: true }, orderBy: { createdAt: 'desc' } });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

// --- BILLING / CASHIER ROUTES ---
app.get("/api/billing/invoices", authenticateToken, async (req: any, res: any) => {
  try {
    const invoices = await prisma.invoice.findMany({ include: { patient: true, prescription: true }, orderBy: { createdAt: 'desc' } });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

app.post("/api/billing/invoices/:id/pay", authenticateToken, requireRole(["ADMIN", "FINANCE"]), async (req: any, res: any) => {
  try {
    const invoice = await prisma.invoice.update({ where: { id: req.params.id }, data: { status: "PAID" } });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: "Failed to process payment" });
  }
});

// --- APPOINTMENTS ROUTES ---
app.get("/api/appointments", authenticateToken, async (req: any, res: any) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { patient: true, doctor: true },
      orderBy: { date: 'asc' }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

app.post("/api/appointments", authenticateToken, requireRole(["ADMIN", "NURSE", "DOCTOR"]), async (req: any, res: any) => {
  try {
    const { patientId, doctorId, date, reason, notes } = req.body;
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId: doctorId || req.user.id,
        date: new Date(date),
        reason,
        notes
      }
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to schedule appointment" });
  }
});

// --- PATIENT BOOKING ROUTES ---
app.get("/api/doctors", authenticateToken, async (req: any, res: any) => {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: "DOCTOR" },
      select: { id: true, name: true, email: true }
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

app.get("/api/appointments/available-slots", authenticateToken, async (req: any, res: any) => {
  try {
    const { doctorId, date } = req.query; // date in YYYY-MM-DD
    if (!doctorId || !date) return res.status(400).json({ error: "Missing doctorId or date" });

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: String(doctorId),
        date: { gte: startDate, lte: endDate }
      }
    });

    const bookedHours = appointments.map(a => new Date(a.date).getUTCHours());
    const workingHours = [9, 10, 11, 13, 14, 15, 16]; // 9 AM to 4 PM (12 PM lunch)
    
    const availableSlots = workingHours.filter(hour => !bookedHours.includes(hour)).map(hour => {
      const slot = new Date(`${date}T00:00:00.000Z`);
      slot.setUTCHours(hour);
      return slot;
    });

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch slots" });
  }
});

app.get("/api/dashboard/stats", authenticateToken, async (req: any, res: any) => {
// ... existing code in /api/dashboard/stats ...
  try {
    const totalPatients = await prisma.patient.count();
    
    // Get start and end of today
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);
    
    const appointmentsToday = await prisma.appointment.count({
      where: { date: { gte: startOfToday, lte: endOfToday } }
    });
    
    const lowStockDrugs = await prisma.drug.count({
      where: { stock: { lt: 50 } } // threshold for low stock
    });

    const paidInvoices = await prisma.invoice.findMany({
      where: { status: "PAID" }
    });
    const monthlyRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

    res.json({
      totalPatients,
      appointmentsToday,
      lowStockDrugs,
      monthlyRevenue
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// Lab Module Endpoints
app.get("/api/lab", authenticateToken, requireRole(["ADMIN", "DOCTOR", "NURSE"]), async (req: any, res: any) => {
  try {
    const labTests = await prisma.labTest.findMany({
      include: { patient: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(labTests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lab tests" });
  }
});

app.post("/api/lab", authenticateToken, requireRole(["ADMIN", "DOCTOR", "NURSE"]), async (req: any, res: any) => {
  try {
    const { patientId, testType, result, notes } = req.body;
    const newTest = await prisma.labTest.create({
      data: { patientId, testType, result, notes }
    });
    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ error: "Failed to create lab test" });
  }
});

app.get("/api/patient/lab", authenticateToken, requireRole(["PATIENT"]), async (req: any, res: any) => {
  try {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    if (!patient) return res.status(404).json({ error: "Patient record not found" });

    const labTests = await prisma.labTest.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(labTests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patient lab tests" });
  }
});

app.get("/api/patient/appointments", authenticateToken, requireRole(["PATIENT"]), async (req: any, res: any) => {
  try {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    if (!patient) return res.status(404).json({ error: "Patient record not found" });

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: { doctor: true },
      orderBy: { date: 'asc' }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patient appointments" });
  }
});

app.post("/api/patient/appointments", authenticateToken, requireRole(["PATIENT"]), async (req: any, res: any) => {
  try {
    const { doctorId, date, reason } = req.body;
    
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    if (!patient) return res.status(404).json({ error: "Patient record not found" });

    const existing = await prisma.appointment.findFirst({
      where: { doctorId, date: new Date(date) }
    });
    if (existing) return res.status(400).json({ error: "Doctor is already booked for this time slot" });

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        date: new Date(date),
        reason
      }
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
