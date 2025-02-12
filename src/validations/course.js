import Joi from "joi";

export const getCourses = {
  params: Joi.object().keys({
    courseId: Joi.number().integer(),
  }),
};

export const getChapters = {
  params: Joi.object().keys({
    chapterId: Joi.number().integer(),
  }),
};
