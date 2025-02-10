import express from "express";
import validate from "../../middlewares/validate.js";
import * as AuthValidator from "../../validations/auth.js";
import * as AuthController from "../../controllers/auth.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.post(
  "/register",
  validate(AuthValidator.register),
  AuthController.register
);
router.post("/login", validate(AuthValidator.login), AuthController.login);
router.post("/logout", validate(AuthValidator.logout), AuthController.logout);
router.post(
  "/refresh-tokens",
  validate(AuthValidator.refreshTokens),
  AuthController.refreshTokens
);
router.post(
  "/forgot-password",
  validate(AuthValidator.forgotPassword),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validate(AuthValidator.resetPassword),
  AuthController.resetPassword
);
router.post(
  "/send-verification-email",
  auth(),
  AuthController.sendVerificationEmail
);
router.post(
  "/verify-email",
  validate(AuthValidator.verifyEmail),
  AuthController.verifyEmail
);

export default router;
