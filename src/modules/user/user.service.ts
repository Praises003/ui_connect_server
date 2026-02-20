import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError";

interface UpdateProfileInput {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  username?: string;
}


/**
 * Get current user's profile
 */
export const getProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      bio: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/**
 * Get user by ID (Public Profile)
 */
export const getUserByIdService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      bio: true,
      avatarUrl: true,
      department: true,
      level: true,
      role: true,
      createdAt: true,
      isOnline: true,
      _count: {
        select: {
          followedBy: true,
          following: true,
          posts: true,
          createdCommunities: true,
        }
      }
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/**
 * Update current user's profile
 */
export const updateProfileService = async (
  userId: string,
  data: UpdateProfileInput
) => {
  // Check if username is being updated and is unique
  if (data.username) {
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });

    // If user exists and it's NOT the current user
    if (existingUser && existingUser.id !== userId) {
      throw new AppError("Username is already taken", 400);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      bio: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

/**
 * Change user password
 */
export const changePasswordService = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new AppError("Old password is incorrect", 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
};
