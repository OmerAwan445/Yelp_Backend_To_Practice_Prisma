import { LoginRequestBody, SignupRequestBody } from '@src/Types';
import { AppError } from '@src/errors/AppError';
import { checkUserEmailUniquenes, createUser, findUserByEmail, findUserById,
  makeUserVerifiedAndDeleteToken } from '@src/models/UserModel';
import { findUserToken } from '@src/models/UserTokenModel';
import { sendVerificationEmailAndSaveToken } from '@src/services/auth/sendVerificationEmailAndSaveToken';
import { extractDataFromCryptoToken } from '@src/services/auth/cryptoVerificationTokenSvs';
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

  // Send verification email and save token
  const { msg } = await sendVerificationEmailAndSaveToken(user.email, "EMAIL_VERIFICATION", user.id);

  return res.send(ApiResponse.success({ ...user }, 'User created successfully & ' + msg, 201));
});

const LoginUser = catchAsyncError(async (req: Request<object, object, LoginRequestBody>, res, next ) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  // Check if user exists && password is correct
  if (!user || !(await comparePassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  if (!user.is_verified) {
    const { msg } = await sendVerificationEmailAndSaveToken(user.email, "EMAIL_VERIFICATION", user.id);
    return res.status(401).send(ApiResponse.error('User Email is not verified & ' + msg, 401, { userId: user.id }));
  }

  const { password:_, ...userWithoutPassword } = user; // eslint-disable-line
  const accessToken = await generateAccessToken({ id: user.id, email:
     user.email, name: user.first_name + user.last_name });

  return res.send(
      ApiResponse.success({ accessToken, ...userWithoutPassword }, "User logged in successfully", 200));
});

const SendVerificationEmail = catchAsyncError(async (req: Request<object, object, { userId: number }>, res) => {
  const { userId } = req.body;
  const user = await findUserById(userId);
  if (!user || user.is_verified) {
    return res.status(404).send(ApiResponse.error("No User Found Or User is Already Verified", 404));
  }
  const userEmail = user.email;
  const { msg, error, statusCode } = await sendVerificationEmailAndSaveToken(userEmail, "EMAIL_VERIFICATION", userId);
  if (error) return res.status(statusCode).send(ApiResponse.error(msg, statusCode)); // token already sent
  return res.send(ApiResponse.success({}, msg, statusCode));
});

const VerifyEmailVerificationToken = catchAsyncError(async (req: Request<any, any, any, { token?: string }>,
    res: Response) => {
  const token = req.query.token as string;
  // 1. check token is correct and extract user id from token.
  const data = extractDataFromCryptoToken(token);
  if (!data || !data.userId ) return res.status(400).send(ApiResponse.error("Invalid token", 400));

  const userToken = await findUserToken(data.userId, "EMAIL_VERIFICATION");
  // 2. check if token is valid from db and is not expired
  if (!userToken || userToken.expiry.getTime() < new Date().getTime() ) {
    return res.status(401).send(ApiResponse.error("Token is invalid or expired", 401));
  }
  // 3. make user is_verified true and Delete the token from the Db
  const user = await makeUserVerifiedAndDeleteToken(data.userId);
  const accessToken = await generateAccessToken({ id: user.id, email:
    user.email, name: user.first_name + user.last_name });

  res.send(ApiResponse.success({ ...user, accessToken }, "User verified successfully", 200));
});

export { LoginUser, SendVerificationEmail, SignupUser, VerifyEmailVerificationToken };

