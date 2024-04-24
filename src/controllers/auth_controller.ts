import { LoginRequestBody, SignupRequestBody } from '@src/Types';
import { AppError } from '@src/errors/AppError';
import { checkUserEmailUniquenes, createUser, findUserByEmail } from '@src/models/UserModel';
import { comparePassword, hashPassword } from '@src/services/bcryptPassword';
import { generateAccessToken } from '@src/services/jwtServices';
import ApiResponse from '@src/utils/ApiResponse';
import { catchAsyncError } from '@src/utils/catchAsyncError';
import { Request, Response } from 'express';

const SignupUser = catchAsyncError(async (req: Request<object, object, SignupRequestBody>, res: Response) => {
  const { first_name, last_name, email, password } = req.body;

  const isEmailUnique = await checkUserEmailUniquenes(email);
  if (isEmailUnique == false) return res.status(409).send(ApiResponse.error('Email already exists', 409));

  const hashedPassword = await hashPassword(password);
  const user = await createUser(first_name, last_name, email, hashedPassword);
  // Verify the user email
  return res.send(ApiResponse.success({ ...user }, 'User created successfully', 201));
});

const LoginUser = catchAsyncError(async (req: Request<object, object, LoginRequestBody>, res, next ) => {
  const { email, password } = req.body;

  if (!email || !password) { // guard clause
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }
  const hashedPassword = user.password;

  // compare the found user hash password and req.body.password.
  const match = await comparePassword(password, hashedPassword);
  if (!match) {
    return next(new AppError("Invalid email or password", 401));
  }
  if (!user.is_verified) return res.status(401).send(ApiResponse.error('User Email is not verified', 401));

  const { password:_, ...userWithoutPassword } = user; // eslint-disable-line
  const accessToken = await generateAccessToken({ id: user.id, email:
     user.email, name: user.first_name + user.last_name });

  return res.send(
      ApiResponse.success({ accessToken, ...userWithoutPassword }, "User logged in successfully", 200));
});

export { SignupUser, LoginUser };
