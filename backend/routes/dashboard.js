const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController");
const verifyToken = require("../middelware/verifyToken");

const router = express.Router();

router.get("/dashboard", verifyToken, getDashboardData);

module.exports = router;
