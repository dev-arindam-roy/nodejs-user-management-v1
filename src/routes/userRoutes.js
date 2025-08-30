const express = require("express");
const UserController = require("../controllers/UserController");

const OrmTestController = require("../controllers/ormTestController");

const router = express.Router();

/**
 * OrmTestController class have normal method, not static method
 * so in that case we need to create class object => const OrmCtrl = new OrmTestController();
 * 
 * if we create static method or functions into the class then we don't need to create class object
 * then we can directly access the method like => OrmTestController.ormQueryTest
 * 
 * if in controller, we export the class like this => module.exports = new OrmTestController();
 * then we don't need to create class like - const OrmCtrl = new OrmTestController();
 * in each section where we call or import the module class
 */
const OrmCtrl = new OrmTestController();

router.post("/register", UserController.register);
router.get("/", UserController.getAll);
router.get("/:id", UserController.getUser);
router.put("/:id", UserController.updateUser);
router.post("/:id/profile-image", UserController.userProfileImage);

router.post("/orm-test-save", OrmCtrl.ormQueryTestSaveInDB);
router.get("/orm-test-get/:id", OrmCtrl.ormQueryTestGetFromDB);

module.exports = router;