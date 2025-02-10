import httpStatus from "http-status";
import pick from "../utils/pick.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import * as UserService from "../services/user.js";

export const createUser = catchAsync(async (req, res) => {
  const user = await UserService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

export const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await UserService.queryUsers(filter, options);
  res.send(result);
});

export const getUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await UserService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

export const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await UserService.updateUserById(userId, req.body);
  res.send(user);
});

export const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  await UserService.deleteUserById(userId);
  res.status(httpStatus.NO_CONTENT).send();
});
