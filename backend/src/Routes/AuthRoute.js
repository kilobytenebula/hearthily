const router = require("express").Router();
const AuthController = require("../Controller/AuthController");
const AuthYup = require("../Utils/Validation/AuthYup");
const validateScehma = require("../Middleware/ValidateSchema");

router.post("/register", validateScehma(AuthYup.registerSchema), AuthController.signUp)
router.post("/login", validateScehma(AuthYup.loginSchema), AuthController.signIn)
router.post("/forgotPassword", validateScehma(AuthYup.forgotPassword), AuthController.forgotPassword)

router.post("/reset-password",AuthController.resetPassword)
router.post("/verify-reset-password/:token",AuthController.verifyResetPassword)

module.exports = router;