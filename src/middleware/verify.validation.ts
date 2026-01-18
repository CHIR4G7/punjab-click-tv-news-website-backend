import { body } from "express-validator";

export const createValidation = [
  body("name")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Length should be greater than 3!"),
  body("username")
    .isString()
    .isLength({ min: 5 })
    .withMessage("Invalid Username!"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password should have minimum 6 characters!"),
];

export const loginValidation = [
  body("username")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid Username!"),

  body("password").isLength({ min: 6 }).withMessage("Invalid Password!"),
];



export const newsValidationRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters')
    .escape(),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters long'),

  body('summary')
    .trim()
    .notEmpty()
    .withMessage('Summary is required')
    .isLength({ min: 20, max: 500 })
    .withMessage('Summary must be between 20 and 500 characters')
    .escape(),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('region')
    .trim()
    .notEmpty()
    .withMessage('Region is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Region must be between 2 and 100 characters')
    .escape(),

  body('coverPageImg')
    .trim()
    .notEmpty()
    .withMessage('Cover image is required')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Cover image must be a valid URL')
    .matches(/\.(jpg|jpeg|png|webp|gif)$/i)
    .withMessage('Cover image must be a valid image URL'),

  body('imageUrls')
    .optional()
    .isArray()
    .withMessage('Image URLs must be an array'),

  body('imageUrls.*')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Each image URL must be valid')
];

