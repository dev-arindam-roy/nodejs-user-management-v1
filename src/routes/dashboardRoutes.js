const express = require("express");
const DashboardController = require("../controllers/DashboardController");

const router = express.Router();

router.post("/myprofile", DashboardController.myProfile);

module.exports = router;