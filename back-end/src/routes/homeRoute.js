const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postControllers");
const { authenticateToken } = require("../controllers/loginControllers"); // 인증 미들웨어 가져오기

// router.get("/", postControllers.getAllpostsHome); // 모든 게시글 조회

router.put("/:id/state", authenticateToken, postControllers.updatePost);
router.put("/bulk-update", authenticateToken, postControllers.updatePostState);

module.exports = router;
