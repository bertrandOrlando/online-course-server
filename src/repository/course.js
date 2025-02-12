import pool from "../config/postgre.js";

export const getCourses = async (courseId) => {
  let query = `SELECT c.course_id, c.teacher_id, c.title, c.description, c.duration, c.duration_unit, c.difficulty, u.name, ch.chapter_id, ch.chapter_order FROM courses c
  JOIN users u ON c.teacher_id = u.user_id
  JOIN course_chapters ch ON c.course_id = ch.course_id
  WHERE 1 = 1
  `;

  const values = [];
  if (courseId) {
    query += ` AND c.course_id = $1`;
    values.push(courseId);
  }

  const { rows } = await pool.query(query, values);

  return rows;
};

export const getChapters = async (chapterId) => {
  const query = `SELECT * FROM course_chapters ch 
    JOIN chapter_contents co ON ch.chapter_id = co.section_id
    WHERE co.content_id = $1`;

  const values = [chapterId];
  const { rows } = await pool.query(query, values);

  return rows;
};
