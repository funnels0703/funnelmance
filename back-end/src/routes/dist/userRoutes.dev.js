"use strict";

// routes/urlCodeRoutes.js
var express = require("express");

var _require = require("../controllers/userController"),
    createUserController = _require.createUserController,
    getAllUsersController = _require.getAllUsersController,
    updateUserController = _require.updateUserController,
    loginController = _require.loginController;

var router = express.Router(); // 유저 등록 라우트

router.post("/register", createUserController);
router.put("/update", updateUserController); // 유저 조회 라우트

router.get("/list", getAllUsersController); // 유저 로그인

router.post("/login", loginController);
module.exports = router;