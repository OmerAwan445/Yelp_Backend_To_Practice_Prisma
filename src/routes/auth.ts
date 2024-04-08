import { SignupUser } from "@src/controllers/auth_controller";
import { signupSchema } from "@src/validations/AuthValidationSchemas";
import { Router as expressRouters } from "express";
import { checkSchema } from "express-validator";

const authRoutes = expressRouters();

authRoutes.route('/signup').post(checkSchema(signupSchema, ['body']), SignupUser);

export default authRoutes;
