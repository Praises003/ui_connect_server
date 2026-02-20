import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../utils/token";

import { AppError } from "../../utils/AppError";
export const registerUser = async (data: {
  email: string;
  password: string;
  fullName: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      username: await generateUniqueUsername(data.email),
    }
  });

  return user;
};

// Helper: Generate unique username
const generateUniqueUsername = async (email: string) => {
  let username = email.split("@")[0];
  let isUnique = false;

  // Check if base username exists
  const existing = await prisma.user.findUnique({ where: { username } });
  if (!existing) return username;

  // Append random numbers until unique
  while (!isUnique) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit
    const candidate = `${username}${randomSuffix}`;
    const check = await prisma.user.findUnique({ where: { username: candidate } });
    if (!check) {
      username = candidate;
      isUnique = true;
    }
  }
  return username;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const payload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const { password: _, refreshToken: __, ...safeUser } = user;

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};


export const refreshUserToken = async (token: string) => {
  const decoded = verifyRefreshToken(token);

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user || user.refreshToken !== token) {
    throw new AppError("Invalid refresh token", 403);
  }

  const payload = {
    userId: user.id,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};


