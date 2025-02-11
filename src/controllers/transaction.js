import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import * as TransactionService from "../services/transaction.js";
import * as MembershipService from "../services/membership.js";
import { membership } from "../config/membership.js";
import { transactionStatusType } from "../config/transaction.js";

export const createTransaction = catchAsync(async (req, res) => {
  const user = req.user;
  const { quantity, duration } = req.body;

  const item = membership[duration];
  item.quantity = quantity;

  const transaction = await TransactionService.createTransaction(user, item);

  res.status(httpStatus.OK).json({
    order_id: transaction.order_id,
    amount: transaction.amount,
    payment_url: transaction.payment_url,
    transaction_time: transaction.transaction_time,
    status: transaction.status,
  });
});

export const checkTransactionStatus = catchAsync(async (req, res) => {
  const transactionData = req.body;
  console.log(transactionData);

  let orderId = transactionData.order_id;
  let transactionStatus = transactionData.transaction_status;
  let fraudStatus = transactionData.fraud_status;

  console.log(
    `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
  );

  if (transactionStatus == "capture" || transactionStatus == "settlement") {
    if (fraudStatus == "accept") {
      const transaction = await TransactionService.finishTransaction(
        transactionData.order_id,
        transactionData.transaction_id,
        transactionStatusType.COMPLETED,
        transactionData.payment_type
      );
      const userId = transaction.user_id;
      const duration =
        transaction.quantity *
        membership[transaction.membership_duration.toUpperCase()].duration;

      // console.log("transaction : ", transaction);
      const newMembership = await MembershipService.addMembership(
        userId,
        duration
      );
      console.log("newMembership : ", newMembership);

      await res.status(httpStatus.OK).send("Transaction succeeded.");
    }
  } else if (
    transactionStatus == "cancel" ||
    transactionStatus == "deny" ||
    transactionStatus == "expire"
  ) {
    await TransactionService.updateTransactionStatus(
      transactionData.order_id,
      transactionStatusType.FAILED
    );
    res.status(httpStatus.OK).send("Transaction failed.");
  } else if (transactionStatus == "pending") {
    await TransactionService.updateTransactionStatus(
      transactionData.order_id,
      transactionStatusType.PENDING
    );
    res.status(httpStatus.OK).send("Transaction pending.");
  }
});
