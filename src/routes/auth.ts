import { LoginUser, SendVerificationEmail, SignupUser } from "@src/controllers/auth_controller";
import { validateRequestSchema } from "@src/middlewares/validate-request-schema";
import { validatePasswordMatch } from "@src/middlewares/validatePasswordMatch";
import { loginSchema, signupSchema, verifyEmailSchema } from "@src/validations/AuthValidationSchemas";
import { Router as expressRouters } from "express";
import { checkSchema } from "express-validator";

const authRoutes = expressRouters();

authRoutes.route('/signup').post(checkSchema(signupSchema, ['body']), validateRequestSchema,
    validatePasswordMatch, SignupUser);

authRoutes.route('/login').post(checkSchema(loginSchema, ['body']), validateRequestSchema, LoginUser);

authRoutes.route('/send-verification-email').
    post(checkSchema(verifyEmailSchema, ['body']), validateRequestSchema, SendVerificationEmail);

export default authRoutes;
