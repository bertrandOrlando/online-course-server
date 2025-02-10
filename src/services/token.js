import jwt from "jsonwebtoken";
import moment from "moment";
import httpStatus from "http-status";
import config from "../config/config.js";
import * as UserService from "./user.js";
import * as TokenRepository from "../repository/token.js";
import ApiError from "../utils/ApiError.js";
import { tokenTypes } from "../config/tokens.js";

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (
  token,
  userId,
  expires,
  type,
  is_blacklisted = false
) => {
  const tokenResult = await TokenRepository.createToken({
    token,
    userId,
    expires: expires.toDate(),
    type,
    is_blacklisted,
  });
  return tokenResult;
};

export const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenResult = await TokenRepository.findOne({
    token,
    type,
    user_id: payload.sub,
    is_blacklisted: false,
  });

  if (!tokenResult) {
    throw new Error("Token not found");
  }

  return tokenResult;
};

export const generateAuthTokens = async (userId) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );

  const accessToken = generateToken(
    userId,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );

  const refreshToken = generateToken(
    userId,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(
    refreshToken,
    userId,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

export const generateResetPasswordToken = async (email) => {
  const user = await UserService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.user_id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.user_id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

export const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user.user_id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(
    verifyEmailToken,
    user.user_id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  return verifyEmailToken;
};
