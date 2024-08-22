const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 모든 사용자 정보 조회
const getAllUsers = async () => {
  try {
    return await prisma.users.findMany();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// 특정 사용자 조회
const getUserById = async (userId) => {
  try {
    return await prisma.users.findUnique({
      where: { userID: userId },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// 사용자 추가
const addUser = async (userData) => {
  try {
    return await prisma.users.create({
      data: userData,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// 사용자 업데이트
const updateUser = async (userId, updatedData) => {
  try {
    return await prisma.users.update({
      where: { userID: userId },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// 사용자 삭제
const deleteUser = async (userId) => {
  try {
    return await prisma.users.delete({
      where: { userID: userId },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// 이메일 조회
const getUserByEmail = async (email) => {
  try {
    return await prisma.users.findUnique({
      where: { email: email },
    });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

// 특정 사용자와 관련된 알림이 있는 게시글 조회
const getNotifiedPostsByUserId = async (userId) => {
  try {
    return await prisma.post.findMany({
      where: {
        userID: userId,
        isNotified: true,
      },
      select: {
        postID: true,
        patientName: true,
        state: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Error fetching notified posts:", error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getNotifiedPostsByUserId,
};
