import { CreateRestaurantRating } from '@src/controllers/restaurant_controller';
import { validateRequestSchema } from '@src/middlewares/validate-request-schema';
import { createRatingSchema, createRatingSchemaParams } from '@src/validations/RestaurantValidaionSchemas';
import { Router as expressRouters } from 'express';
import { checkSchema } from 'express-validator';

const restaurantRoutes = expressRouters();

restaurantRoutes.post('/:restaurantId/ratings', checkSchema(createRatingSchema, ['body']),
    checkSchema(createRatingSchemaParams, ['params']), validateRequestSchema,
    CreateRestaurantRating);

export default restaurantRoutes;
