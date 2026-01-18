import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import jwt from "jsonwebtoken";

interface CreateAdminInput {
  name: string;
  username: string;
  password: string;
}

export const createAdminService = async (data: CreateAdminInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const res = await prisma.admin.create({
    data: {
      name: data.name,
      username: data.username,
      password: hashedPassword,
    },
  });
  return res;
};

export const loginAdminService = async (username: string, password: string) => {
  const existingUser = await prisma.admin.findUnique({
    where: {
      username: username,
    },
  });

  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  const isValidPass = await bcrypt.compare(password, existingUser.password);
  if (!isValidPass) {
    throw new Error("PASSWORD_INVALID");
  }

  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    username: existingUser.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: "2h",
  });

  return { existingUser, token };
};
