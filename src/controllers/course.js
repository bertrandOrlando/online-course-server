import * as CourseService from "../services/course.js";
import catchAsync from "../utils/catchAsync.js";
import httpStatus from "http-status";

export const getCourses = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;

  const courses = await CourseService.getCourses(courseId);

  res.status(httpStatus.OK).send(courses);
});

export const getChapters = catchAsync(async (req, res) => {
  const chapterId = req.params.chapterId;

  const courses = await CourseService.getChapters(chapterId);

  res.status(httpStatus.OK).send(courses);
});
