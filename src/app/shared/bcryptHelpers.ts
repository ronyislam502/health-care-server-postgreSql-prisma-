import bcrypt from "bcrypt";

export const hashPassword = async (
  password: string,
  saltRounds: string
): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
