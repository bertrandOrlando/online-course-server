import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import * as AuthService from "../services/auth.js";
import * as UserService from "../services/user.js";
import * as TokenService from "../services/token.js";
import * as EmailService from "../services/email.js";

export const register = catchAsync(async (req, res) => {
  const user = await UserService.createUser(req.body);
  const tokens = await TokenService.generateAuthTokens(user.user_id);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await AuthService.loginUserWithEmailAndPassword(email, password);
  const tokens = await TokenService.generateAuthTokens(user.user_id);
  res.send({ user, tokens });
});

export const logout = catchAsync(async (req, res) => {
  await AuthService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await AuthService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await TokenService.generateResetPasswordToken(
    req.body.email
  );
  await EmailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPassword = catchAsync(async (req, res) => {
  await AuthService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await TokenService.generateVerifyEmailToken(
    req.user
  );
  await EmailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const verifyEmail = catchAsync(async (req, res) => {
  await AuthService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});
