const { Router } = require("express");
const { loginController, registerController } = require("../controllers/auth");

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);

module.exports = router;