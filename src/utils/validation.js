import Joi from "joi";

export const loginUserValidation = (data) => {
  const schema = Joi.object({
    login: Joi.string().required().label("login"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};

export const joinWindowValidation = (data) => {
    const schema = Joi.object({
      userId: Joi.number().required().label("userId"),
      windowId: Joi.number().required().label("windowId"),
    });
    return schema.validate(data);
};

export const createAppealValidation = (data) => {
    const schema = Joi.object({
      type: Joi.string().required().label("type"),
    });
    return schema.validate(data);
  };