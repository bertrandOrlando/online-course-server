import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import * as TokenService from "./token.js";
import * as UserService from "./user.js";
import * as TokenRepository from "../repository/token.js";
import ApiError from "../utils/ApiError.js";
import { tokenTypes } from "../config/tokens.js";

export const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await UserService.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  return user;
};

export const logout = async (refreshToken) => {
  const refreshTokenDoc = await TokenRepository.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    is_blacklisted: false,
  });

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await TokenRepository.removeToken({
    token: refreshToken,
    type: tokenTypes.REFRESH,
  });
};

export const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await TokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );

    const user = await UserService.getUserById(refreshTokenDoc.user_id);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
    }

    await TokenRepository.removeToken({
      token: refreshToken,
      type: tokenTypes.REFRESH,
      user_id: refreshTokenDoc.user_id,
      is_blacklisted: false,
    });

    return TokenService.generateAuthTokens(user.user_id);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

export const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await TokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await UserService.getUserById(resetPasswordTokenDoc.user_id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "No users found");
    }
    await UserService.updateUserById(user.user_id, { password: newPassword });
    await TokenRepository.deleteMany({
      user_id: user.user_id,
      type: tokenTypes.RESET_PASSWORD,
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

export const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await TokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await UserService.getUserById(verifyEmailTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }
    await TokenRepository.deleteMany({
      user_id: user.user_id,
      type: tokenTypes.VERIFY_EMAIL,
    });
    await UserService.updateUserById(user.user_id, { is_email_verified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};
