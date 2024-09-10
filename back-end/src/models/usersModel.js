// src/models/userModel.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const createUser = async (userData) => {
  const {
    username,
    password,
    name,
    role = "USER",
    is_active = true,
  } = userData;
  try {
    // 유저 생성
    return await prisma.user.create({
      data: {
        username,
        password,
        name,
        role,
        is_active,
      },
    });
  } catch (error) {
    console.error("유저 생성 중 오류 발생:", error);
    throw error;
  }
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      user_id: true,
      username: true,
      name: true,
      role: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    },
  });
};

const updateUser = async (user_id, data) => {
  return prisma.user.update({
    where: { user_id: parseInt(user_id) },
    data: {
      name: data.name,
      role: data.role,
      is_active: Boolean(data.is_active),
    },
  });
};
const getUserByUsername = async (username) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user;
  } catch (error) {
    console.error("사용자 조회 중 오류 발생:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  getUserByUsername,
};
