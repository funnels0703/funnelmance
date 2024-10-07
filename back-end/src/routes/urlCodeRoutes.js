// routes/urlCodeRoutes.js
const express = require("express");
const {
  createUrlCodeController,
  getCodesController,
  updateCodesController,
  deleteUrlCodeController,
  // 접속관련
  getUrlCodeData,
  postUrlCodeData,
} = require("../controllers/urlCodeControllers");
const router = express.Router();

// 코드 리스트 조회
router.post("/new", createUrlCodeController);
router.get("/list", getCodesController);
router.put("/update/:id", updateCodesController);
router.delete("/delete/:id", deleteUrlCodeController);

// 접속관련
// URL 코드에 대한 GET 요청 라우트
router.get("/:urlCode", getUrlCodeData);
router.post("/:urlCode", postUrlCodeData);

module.exports = router;
