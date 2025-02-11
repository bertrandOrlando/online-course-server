import Joi from "joi";

export const createTransaction = {
  body: Joi.object().keys({
    quantity: Joi.number().required().min(1),
    duration: Joi.string().required().valid("MONTHLY", "YEARLY"),
  }),
};
