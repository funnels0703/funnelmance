// routes/mainRoute.js
const express = require("express");
const router = express.Router();

const customorRoutes = require("./customorRoutes");
const urlCodeRoutes = require("./urlCodeRoutes");

router.use("/urlcode", urlCodeRoutes);
router.use("/customor", customorRoutes);

module.exports = router;
