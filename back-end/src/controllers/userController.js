// src/controllers/userController.js

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
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: "유저 조회 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};

const updateUserController = async (req, res) => {
  const { user_id, name, role, is_active } = req.body;
  try {
    const updatedUser = await updateUser(user_id, {
      name,
      role,
      is_active,
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
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET, // 환경변수에서 JWT 비밀키를 가져옵니다.
      { expiresIn: "1h" }
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
