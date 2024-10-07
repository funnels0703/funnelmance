"use strict";

// routes/urlCodeRoutes.js
var express = require("express");

var _require = require("../controllers/urlCodeControllers"),
    createUrlCodeController = _require.createUrlCodeController,
    getCodesController = _require.getCodesController,
    updateCodesController = _require.updateCodesController,
    deleteUrlCodeController = _require.deleteUrlCodeController,
    getUrlCodeData = _require.getUrlCodeData,
    postUrlCodeData = _require.postUrlCodeData;

var router = express.Router(); // 코드 리스트 조회

router.post("/new", createUrlCodeController);
router.get("/list", getCodesController);
router.put("/update/:id", updateCodesController);
router["delete"]("/delete/:id", deleteUrlCodeController); // 접속관련
// URL 코드에 대한 GET 요청 라우트

router.get("/:urlCode", getUrlCodeData);
router.post("/:urlCode", postUrlCodeData);
module.exports = router;