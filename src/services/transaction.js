import Midtrans from "midtrans-client";
import moment from "moment";
import config from "../config/config.js";
import * as TransactionRepository from "../repository/transaction.js";

export const createTransaction = async (user, item) => {
  let snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: config.midtrans.serverKey,
  });

  const orderId = `ORDER-${user.user_id}${Date.now()}`;
  const amount = item.price * item.quantity;

  let parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    item_details: [
      {
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      },
    ],
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
  };

  const midtransTransaction = await snap.createTransaction(parameter);

  if (!midtransTransaction.redirect_url) {
    throw new Error("Failed to create transaction");
  }

  const paymentUrl = midtransTransaction.redirect_url;
  const transaction = await TransactionRepository.createTransaction(
    orderId,
    user.user_id,
    amount,
    paymentUrl,
    item.quantity,
    item.type
  );

  return transaction;
};

export const finishTransaction = async (
  orderId,
  transactionId,
  status,
  method
) => {
  const settlementTime = moment();

  const updatedTransaction = await TransactionRepository.updateTransaction(
    orderId,
    {
      transaction_id: transactionId,
      status: status,
      method: method,
      settlement_time: settlementTime,
    }
  );

  return updatedTransaction;
};

export const updateTransactionStatus = async (orderId, status) => {
  const updatedTransaction = await TransactionRepository.updateTransaction(
    orderId,
    {
      status: status,
    }
  );

  return updatedTransaction;
};
