// routes/urlCodeRoutes.js
const express = require("express");
const {
  getCodesController,
  getUrlCodeData,
  createUrlCodeController,
  postUrlCodeData,
} = require("../controllers/urlCodeControllers");
const router = express.Router();

//코드 리스트 조회
router.get("/list", getCodesController);

// URL 코드에 대한 GET 요청 라우트
router.get("/:urlCode", getUrlCodeData);
router.post("/:urlCode", postUrlCodeData);

router.post("/", createUrlCodeController);

module.exports = router;
