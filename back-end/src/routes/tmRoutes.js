const express = require("express");
const {
  getNoticesController,
  getNoticeByIdController,
  createNoticeController,
  updateNoticeController,
  deleteNoticeController,
} = require("../controllers/noticeController");

const router = express.Router();

router.get("/notices", getNoticesController);
router.get("/notices/:id", getNoticeByIdController);

// 새로운 공지사항 생성
router.post("/notices/new", createNoticeController);

// 공지사항 수정, 삭제
router.put("/notices/:id", updateNoticeController);
router.delete("/notices/:id", deleteNoticeController);

module.exports = router;
