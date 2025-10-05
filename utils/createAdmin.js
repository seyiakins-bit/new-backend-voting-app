import bcrypt from "bcrypt";
import prisma from "./utils/prismaClient.js";

const createAdmin = async () => {
  const email = "admin@example.com"; // change if needed
  const password = "AdminPassword123"; // plain password you want
  const name = "Admin Name";

  // check if admin exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists!");
    process.exit(0);
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create admin
  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", admin);
  process.exit(0);
};

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
