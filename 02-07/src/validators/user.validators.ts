import * as Joi from '@hapi/joi'
import { createValidator } from 'express-joi-validation'
import { LanguageMessages } from '@hapi/joi';

export const userValidator = createValidator({
    passError: false,
    statusCode: 400
});

const passwordRegexp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');
const passwordErrorMessages: LanguageMessages = {
    'string.pattern.base': 'Password must contain at least one of each: lowercase alphabetical, uppercase alphabetical, numeric characters',
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
}

export const registerUserSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().min(8).regex(passwordRegexp).required().messages(passwordErrorMessages),
    age: Joi.number().min(4).max(140).required()
})

export const updateUserSchema = Joi.object({
    login: Joi.string(),
    password: Joi.string().min(8).regex(passwordRegexp).messages(passwordErrorMessages),
    age: Joi.number().min(4).max(140)
})

export const loginUserSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().min(8).regex(passwordRegexp).required().messages(passwordErrorMessages)
});
