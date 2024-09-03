// routes/urlCodeRoutes.js
const express = require("express");

const {
  createUserController,
  getAllUsersController,
  updateUserController,
} = require("../controllers/userController");
const router = express.Router();

// 유저 등록 라우트
router.post("/register", createUserController);
router.put("/update", updateUserController);
// 유저 조회 라우트
router.get("/list", getAllUsersController);
module.exports = router;
