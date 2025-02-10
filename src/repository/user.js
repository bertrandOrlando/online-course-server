import pool from "../config/postgre.js";

export const createUser = async ({ email, password, name }) => {
  const query =
    "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, 'student') RETURNING *";
  const { rows } = await pool.query(query, [email, password, name]);

  return rows[0];
};

export const paginate = async (filter, options) => {
  let query = "SELECT * FROM users WHERE 1 = 1 ";

  let order = 1;
  const values = [];

  for (const key in filter) {
    query += ` AND ${key} = $${order} `;
    values.push(filter[key]);
    order++;
  }

  if (options.sortBy) {
    query += " ORDER BY $${order} ";
    values.push(options.sortBy);
    order++;
  }

  if (options.limit) {
    query += " LIMIT $${order} ";
    values.push(options.limit);
    order++;
  }

  if (options.page) {
    let offset = options.page - 1;
    if (options.limit) {
      offset *= options.limit;
    }
    query += " OFFSET $${order} ";
    values.push(offset);
    order++;
  }

  const { rows } = await pool.query(query, values);

  return rows;
};

export const getUserById = async (userId) => {
  const query = "SELECT * FROM users WHERE user_id = $1 AND is_active = TRUE ";
  const { rows } = await pool.query(query, [userId]);

  return rows[0];
};

export const getUserByEmail = async ({ email }) => {
  const query = "SELECT * FROM users WHERE email = $1 AND is_active = TRUE ";
  const { rows } = await pool.query(query, [email]);

  return rows[0];
};

export const isEmailTaken = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1 AND is_active = TRUE ";
  const { rows } = await pool.query(query, [email]);

  return rows.length > 0;
};

export const updateUserById = async (userId, updateBody) => {
  let query = "UPDATE users SET ";
  const values = [];
  let order = 1;
  for (const key in updateBody) {
    query += `${key} = $${order} `;
    if (order < Object.keys(updateBody).length) {
      query += ", ";
    }
    values.push(updateBody[key]);
    order++;
  }

  query += ` WHERE user_id = $${order} RETURNING *`;
  values.push(userId);

  const { rows } = await pool.query(query, values);

  return rows;
};

export const deleteUserById = async (userId) => {
  const query = "UPDATE users SET is_active = FALSE WHERE user_id = $1 ";
  await pool.query(query, [userId]);
};
