const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

const AuthCtrl = new AuthController();

router.post("/signup", AuthCtrl.signup);
router.post("/signin", AuthCtrl.signin);
router.post("/token", AuthCtrl.createToken);
router.post("/logout", AuthCtrl.logout);

module.exports = router;