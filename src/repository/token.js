import httpStatus from "http-status";
import pool from "../config/postgre.js";
import ApiError from "../utils/ApiError.js";

export const createToken = async ({
  token,
  userId,
  expires,
  type,
  is_blacklisted,
}) => {
  const query =
    "INSERT INTO auth_tokens (token, user_id, expires_at, type, is_blacklisted) VALUES ($1, $2, $3, $4, $5) RETURNING *";

  const values = [token, userId, expires, type, is_blacklisted];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

export const findOne = async (filter) => {
  const values = [];
  if (!filter.token) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Token must be provided");
  }

  let query = `SELECT * FROM auth_tokens WHERE 1 = 1 `;
  let order = 1;
  for (const key in filter) {
    query += ` AND ${key} = $${order}`;
    values.push(filter[key]);
    order++;
  }

  const { rows } = await pool.query(query, values);

  if (rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
  }

  return rows[0];
};

export const removeToken = async (filter) => {
  const values = [];
  if (!filter.token) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Token must be provided");
  }

  let query = `UPDATE auth_tokens SET is_blacklisted = true WHERE 1 = 1 `;

  let order = 1;
  for (const key in filter) {
    query += ` AND ${key} = $${order}`;
    values.push(filter[key]);
    order++;
  }

  await pool.query(query, values);
};

export const deleteMany = async (filter) => {
  const values = [];
  if (Object.keys(filter).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Filter must be provided");
  }

  let query = `UPDATE auth_tokens SET is_blacklisted = true WHERE 1 = 1 `;

  let order = 1;
  for (const key in filter) {
    query += ` AND ${key} = $${order}`;
    values.push(filter[key]);
    order++;
  }

  await pool.query(query, values);
};
