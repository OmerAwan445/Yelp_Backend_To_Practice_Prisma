import { Schema } from "express-validator";

export const createRatingSchema: Schema = {
  rating: {
    notEmpty: true,
    isFloat: {
      options: { min: 1, max: 5 },
      errorMessage: "Rating must be between 1 and 5",
    },
    errorMessage: "rating is required",
  },
  review: {
    notEmpty: true,
    isString: {
      errorMessage: "Review must be a string",
    },
    errorMessage: "review is required",
  },
};

export const createRatingSchemaParams: Schema = {
  restaurantId: {
    notEmpty: true,
    custom: {
      options: (value: string) => {
        const parsedValue = parseInt(value, 10);
        if (
          isNaN(parsedValue) ||
          parsedValue <= 0 ||
          !Number.isInteger(parsedValue)
        ) {
          throw new Error("restaurantId must be an integer greater than 0");
        }
        return true;
      },
    },
    errorMessage: "restaurantId is required",
  },
};
