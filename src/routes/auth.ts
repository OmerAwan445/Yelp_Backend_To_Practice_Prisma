import { LoginUser, SignupUser } from "@src/controllers/auth_controller";
import { validateRequestSchema } from "@src/middlewares/validate-request-schema";
import { validatePasswordMatch } from "@src/middlewares/validatePasswordMatch";
import { loginSchema, signupSchema } from "@src/validations/AuthValidationSchemas";
import { Router as expressRouters } from "express";
import { checkSchema } from "express-validator";

const authRoutes = expressRouters();

authRoutes.route('/signup').post(checkSchema(signupSchema, ['body']), validateRequestSchema,
    validatePasswordMatch, SignupUser);

authRoutes.route('/login').post(checkSchema(loginSchema, ['body']), validateRequestSchema, LoginUser);

export default authRoutes;
