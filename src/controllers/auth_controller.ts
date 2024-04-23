import { SignupRequestBody } from '@src/Types';
import { checkUserEmailUniquenes, createUser } from '@src/services/auth/UserSvs';
import { hashPassword } from '@src/services/bcryptPassword';
import ApiResponse from '@src/utils/ApiResponse';
import { catchAsyncError } from '@src/utils/catchAsyncError';
import { Request, Response } from 'express';

const SignupUser = catchAsyncError(async (req: Request<object, object, SignupRequestBody>, res: Response) => {
  const { first_name, last_name, email, password } = req.body;

  const isEmailUnique = await checkUserEmailUniquenes(email);
  if (isEmailUnique == false) return res.status(409).send(ApiResponse.error('Email already exists', 409));

  const hashedPassword = await hashPassword(password);
  const user = await createUser(first_name, last_name, email, hashedPassword);
  // const accessToken = await generateAccessToken({ id: user.id, email: user.email,
  // name: user + user.last_name });
  // Verify the user email
  return res.send(ApiResponse.success({ ...user }, 'User created successfully', 201));
});

export { SignupUser };
