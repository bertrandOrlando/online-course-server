import express from "express";
import validate from "../../middlewares/validate.js";
import * as CourseValidator from "../../validations/course.js";
import * as CourseController from "../../controllers/course.js";

const router = express.Router();

router.route("/").get(CourseController.getCourses);

router
  .route("/:courseId")
  .get(validate(CourseValidator.getCourses), CourseController.getCourses);

router
  .route("/chapter/:chapterId")
  .get(validate(CourseValidator.getChapters), CourseController.getChapters);

export default router;
