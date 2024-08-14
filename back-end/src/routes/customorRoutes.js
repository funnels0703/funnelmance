// routes/customor.js
const express = require("express");
const {
  fetchCustomorData,
  submitCustomorData,
  updateCustomorData,
} = require("../controllers/customorContorllers");

const router = express.Router();

router.get("/", fetchCustomorData);
router.post("/", submitCustomorData);
router.put("/:id", updateCustomorData); // 기존 데이터를 수정하기

module.exports = router;
