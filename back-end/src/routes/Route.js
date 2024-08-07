// routes/mainRoute.js
const express = require("express");
const router = express.Router();

const urlCodeRoutes = require("./urlCodeRoutes");

router.use("/urlcode", urlCodeRoutes);

module.exports = router;
