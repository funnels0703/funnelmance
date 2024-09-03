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

  // 비밀번호 해시화
  const hashedPassword = await bcrypt.hash(password, 10);

  // 유저 생성
  return await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
      role,
      is_active,
    },
  });
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
module.exports = {
  createUser,
  getAllUsers,
  updateUser,
};
