import pool from "../config/postgre.js";
import moment from "moment";

export const addMembership = async (userId, duration) => {
  const getMembershipStatusQuery =
    "SELECT * FROM memberships WHERE user_id = $1 ORDER BY end_date DESC";
  const { rows } = await pool.query(getMembershipStatusQuery, [userId]);

  const currentDate = moment().format("YYYY-MM-DD");

  if (rows.length > 0) {
    const currentMembership = rows[0];

    if (currentMembership.endDate > currentDate) {
      const membershipType = "pro";
      const startDate = currentDate;
      const endDate = moment().add(duration, "days").format("YYYY-MM-DD");

      const updateMembershipQuery = `UPDATE memberships SET tier = $1, start_date = $2, end_date = $3 WHERE membership_id = $4 RETURNING *`;
      const values = [
        membershipType,
        startDate,
        endDate,
        currentMembership.membership_id,
      ];

      const { rows } = await pool.query(updateMembershipQuery, values);

      return rows[0];
    } else {
      const membershipType = "pro";

      const updateMembershipQuery = `UPDATE memberships SET tier = $1, end_date = end_date + $2::INTERVAL WHERE membership_id = $3 RETURNING *`;
      const values = [
        membershipType,
        `${duration} days`,
        currentMembership.membership_id,
      ];

      const { rows } = await pool.query(updateMembershipQuery, values);

      return rows[0];
    }
  } else {
    const membershipType = "pro";
    const startDate = currentDate;
    const endDate = moment().add(duration, "days").format("YYYY-MM-DD");

    const addMembershipQuery =
      "INSERT INTO memberships (user_id, tier, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [userId, membershipType, startDate, endDate];
    const { rows } = await pool.query(addMembershipQuery, values);

    return rows[0];
  }
};
