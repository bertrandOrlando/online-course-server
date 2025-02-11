import express from "express";
import validate from "../../middlewares/validate.js";
import * as WebhookValidator from "../../validations/webhook.js";
import * as TransactionController from "../../controllers/transaction.js";

const router = express.Router();

router
  .route("/transaction")
  .post(
    validate(WebhookValidator.checkTransactionStatus),
    TransactionController.checkTransactionStatus
  );

export default router;
