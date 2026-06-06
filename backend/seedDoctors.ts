import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const doctors = [
  "dr. Armand Wiratama, Sp.PD",
  "dr. Keandra Maheswara, Sp.B",
  "dr. Nadine Aurelia, Sp.A",
  "dr. Rafael Pradipta, Sp.JP",
  "dr. Althea Maharani, Sp.OG",
  "dr. Rayyan Adiwangsa, Sp.OT",
  "dr. Clarissa Anandita, Sp.KK",
  "dr. Darren Mahendra, Sp.S",
  "dr. Vania Kartika, Sp.M",
  "dr. Elang Baskara, Sp.THT-KL"
];

async function seed() {
  const hashedPassword = await bcrypt.hash("doctor123", 10);
  
  for (const name of doctors) {
    // Generate an email like armand.wiratama@hospital.com
    let baseName = name.replace("dr. ", "").split(",")[0].toLowerCase().replace(/ /g, ".");
    const email = `${baseName}@hospital.com`;
    
    // check if exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "DOCTOR"
        }
      });
      console.log(`Added: ${name} (${email})`);
    } else {
      console.log(`Skipped (already exists): ${name}`);
    }
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());
