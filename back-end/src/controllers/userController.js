// src/controllers/userController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  getAllUsers,
  createUser,
  updateUser,
  getUserByUsername,
} = require("../models/usersModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUserController = async (req, res) => {
  try {
    console.log(1);
    const newUser = await createUser(req.body);
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      error: "유저 생성 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};

const getAllUsersController = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // 클라이언트에서 페이지와 항목 수를 받음
  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);
  try {
    const totalItems = await prisma.user.count(); // 전체 유저 수 계산
    const totalPages = Math.ceil(totalItems / limitInt); // 전체 페이지 수 계산

    // 유저 데이터 가져오기 (페이지네이션 적용)
    const users = await prisma.user.findMany({
      skip: (pageInt - 1) * limitInt, // 페이지 건너뛰기
      take: limitInt, // 페이지당 가져올 항목 수
      select: {
        user_id: true,
        password: true,
        username: true,
        name: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        hospital_name_id: true,
      },
      orderBy: {
        user_id: "desc", // user_id를 기준으로 내림차순 정렬
      },
    });

    res.status(200).json({
      users, // 유저 데이터 반환
      totalPages, // 전체 페이지 수
      currentPage: pageInt, // 현재 페이지
    });
    console.log(11);
  } catch (error) {
    res.status(500).json({
      error: "유저 조회 중 오류가 발생했습니다.",
      details: error.message,
    });
    console.log(error);
  }
};

const updateUserController = async (req, res) => {
  const { user_id, name, role, is_active, hospital_name_id } = req.body;
  try {
    const updatedUser = await updateUser(user_id, {
      name,
      role,
      is_active,
      hospital_name_id,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      error: "유저 정보 수정 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};

// 로그인
const loginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET, // 환경변수에서 JWT 비밀키를 가져옵니다.
      { expiresIn: "12h" }
    );

    res.json({
      message: "로그인 성공",
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: "로그인 처리 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};
module.exports = {
  createUserController,
  getAllUsersController,
  updateUserController,
  loginController,
};
