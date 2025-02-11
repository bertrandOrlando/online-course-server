import Joi from "joi";

export const checkTransactionStatus = {
  body: Joi.object()
    .keys({
      transaction_id: Joi.string().required(),
      transaction_status: Joi.string().required(),
      order_id: Joi.string().required(),
      payment_type: Joi.string().required(),
      status_code: Joi.string().required(),
      fraud_status: Joi.string().required(),
    })
    .unknown(true),
};
