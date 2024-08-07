// routes/userRoute.js
const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers");
const loginControllers = require("../controllers/loginControllers");
const { authenticateToken } = require("../controllers/loginControllers");

// 사용자 관련 라우트 설정
// router.get("/", usersControllers.getAllUsersInfo); // 모든 유저 정보 가져오기
// router.get("/:id", usersControllers.getUserInfo); // 유저 정보 가져오기
// router.put("/:id", usersControllers.updateUserInfo); // 유저 정보 수정

router.post("/join", usersControllers.addUser);
router.post("/login", loginControllers.loginUser);

// 알람기능
router.get(
  "/notified-posts",
  authenticateToken,
  usersControllers.getUserNotifiedPosts
);
module.exports = router;
