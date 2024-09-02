// routes/mainRoute.js
const express = require("express");
const router = express.Router();

const customorRoutes = require("./customorRoutes");
const urlCodeRoutes = require("./urlCodeRoutes");
const listRoutes = require("./listRoutes");

router.use("/urlcode", urlCodeRoutes);
router.use("/customor", customorRoutes);
router.use("/list", listRoutes);

module.exports = router;
