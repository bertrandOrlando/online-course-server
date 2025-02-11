import pool from "../config/postgre.js";
import moment from "moment";

export const addMembership = async (userId, duration) => {
  const getMembershipStatusQuery =
    "SELECT * FROM membership WHERE user_id = $1";
  const { rows } = await pool.query(getMembershipStatusQuery, [userId]);

  if (rows.length > 0) {
    const updateMembershipQuery =
      "UPDATE membership SET end_date = end_date + INTERVAL $1 WHERE user_id = $2 RETURNING *";
    const values = [`${duration} days`, userId];
    const { rows } = await pool.query(updateMembershipQuery, values);

    return rows[0];
  } else {
    const startDate = moment().format("YYYY-MM-DD");
    const endDate = moment().add(duration, "days").format("YYYY-MM-DD");

    const addMembershipQuery =
      "INSERT INTO membership (user_id, tier, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [userId, "pro", startDate, endDate];
    const { rows } = await pool.query(addMembershipQuery, values);

    return rows[0];
  }
};
