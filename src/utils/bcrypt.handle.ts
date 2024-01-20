import { compare, hash } from "bcryptjs";

const encrypt = async (password: string) => {
  const salt = await hash(password, 10);
  return salt;
};

const verify = async (password: string, passwordEncrypted: string) => {
  const isValid = await compare(password, passwordEncrypted);
  return isValid;
};

export { encrypt, verify };
