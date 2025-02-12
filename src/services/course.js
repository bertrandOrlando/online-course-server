import * as CourseRepository from "../repository/course.js";

export const getCourses = async (courseId) => {
  const courses = await CourseRepository.getCourses(courseId);

  return courses;
};

export const getChapters = async (chapterId) => {
  const chapters = await CourseRepository.getChapters(chapterId);

  return chapters;
};
