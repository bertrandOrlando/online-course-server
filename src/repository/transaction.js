import pool from "../config/postgre.js";

export const createTransaction = async (
  orderId,
  userId,
  amount,
  paymentUrl
) => {
  const query =
    "INSERT INTO transactions (order_id, user_id, amount, payment_url) VALUES ($1, $2, $3, $4) RETURNING *";

  const values = [orderId, userId, amount, paymentUrl];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const updateTransaction = async (orderId, updatedData) => {
  let query = "UPDATE transactions SET ";
  const values = [];
  let order = 1;

  for (const key in updatedData) {
    if (order > 1) {
      query += ", ";
    }
    query += `${key} = $${order}`;
    values.push(updatedData[key]);
    order += 1;
  }

  query += ` WHERE order_id = $${order}`;
  values.push(orderId);

  query += " RETURNING *";
  const { rows } = await pool.query(query, values);

  return rows[0];
};
