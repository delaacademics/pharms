import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function run() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.update({
    where: { email: "admin@hospital.com" },
    data: { password: hashedPassword }
  });
  console.log("Password reset to admin123");
}
run();
