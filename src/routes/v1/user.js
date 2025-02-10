import express from "express";
import validate from "../../middlewares/validate.js";
import * as UserController from "../../controllers/user.js";
import * as UserValidation from "../../validations/user.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(
    auth("manageUsers"),
    validate(UserValidation.createUser),
    UserController.createUser
  )
  .get(
    auth("getUsers"),
    validate(UserValidation.getUsers),
    UserController.getUsers
  );

router
  .route("/:userId")
  .get(
    auth("getUsers"),
    validate(UserValidation.getUser),
    UserController.getUser
  )
  .patch(
    auth("manageUsers"),
    validate(UserValidation.updateUser),
    UserController.updateUser
  )
  .delete(
    auth("manageUsers"),
    validate(UserValidation.deleteUser),
    UserController.deleteUser
  );

export default router;
