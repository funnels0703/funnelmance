const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postControllers");
const fileUploadGet = require("../middleware/fileupload"); // fileupload 미들웨어 import
const { authenticateToken } = require("../controllers/loginControllers"); // 인증 미들웨어 가져오기

// 여러 파일을 업로드하는 경우:
router.post("/", authenticateToken, (req, res, next) => {
  if (req.query.type === "1") {
    fileUploadGet.fileupload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      postControllers.addPost(req, res); // 게시글 추가
    });
  } else if (req.query.type === "2") {
    postControllers.addProsthesisType(req, res); // 보철물 추가
  } else {
    return res.status(400).json({ message: "Invalid 'type' query parameter" });
  }
});

// 알림 삭제
router.put("/noticed", authenticateToken, postControllers.markPostAsNoticed);

// 게시글 수정
router.put(
  "/:id",
  authenticateToken,
  (req, res, next) => {
    fileUploadGet.fileupload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      next(); // 오류가 없다면 다음 미들웨어로 넘어감
    });
  },
  postControllers.updatePost // 게시글 업데이트 컨트롤러 호출
);

// 게시글 삭제
router.delete("/:id", authenticateToken, postControllers.deletePost);

router.get("/", authenticateToken, postControllers.getAllpostsPost); // 모든 게시글 조회
router.get("/:id", postControllers.getPostById); // 특정 게시글 조회

module.exports = router;
