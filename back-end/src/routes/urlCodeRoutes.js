// routes/urlCodeRoutes.js
const express = require("express");
const {
  getUrlCodeData,
  createUrlCodeController,
  postUrlCodeData,
} = require("../controllers/urlCodeControllers");
const router = express.Router();

// URL 코드에 대한 GET 요청 라우트
router.get("/:urlCode", getUrlCodeData);
router.post("/:urlCode", postUrlCodeData);

router.post("/", createUrlCodeController);

module.exports = router;
