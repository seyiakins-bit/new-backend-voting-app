import bcrypt from "bcrypt";

const hashPassword = async () => {
  const password = "Akins1234";
  const hashed = await bcrypt.hash(password, 10);
  console.log(hashed);
};

hashPassword();
