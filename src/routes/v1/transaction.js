import express from "express";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import * as TransactionValidator from "../../validations/transaction.js";
import * as TransactionController from "../../controllers/transaction.js";

const router = express.Router();

router
  .route("/")
  .post(
    auth(),
    validate(TransactionValidator.createTransaction),
    TransactionController.createTransaction
  );

export default router;
