import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import * as UserRepository from "../repository/user.js";

export const createUser = async (userBody) => {
  if (await UserRepository.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const hashedPassword = await bcrypt.hash(userBody.password, 10);

  userBody.password = hashedPassword;

  return UserRepository.createUser(userBody);
};

export const queryUsers = async (filter, options) => {
  return UserRepository.paginate(filter, options);
};

export const getUserById = async (userId) => {
  return UserRepository.getUserById(userId);
};

export const getUserByEmail = async (email) => {
  return UserRepository.getUserByEmail({ email });
};

export const updateUserById = async (userId, updateBody) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    if (
      updateBody.email &&
      (await UserRepository.isEmailTaken(updateBody.email))
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    if (updateBody.password) {
      const hashedPassword = await bcrypt.hash(updateBody.password, 10);
      updateBody.password = hashedPassword;
    }

    const newUser = await UserRepository.updateUserById(userId, updateBody);
    return newUser;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update information");
  }
};

export const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  await UserRepository.deleteUserById(userId);

  return user;
};
