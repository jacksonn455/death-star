const { Router } = require("express");
const { loginController, registerController, logoutController } = require("../controllers/auth");
const { refreshTokenController } = require("../controllers/refreshToken");

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

module.exports = router;
