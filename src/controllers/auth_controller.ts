import { SignupRequestBody } from '@src/Types';
import { prisma } from '@src/db';
import { generateAccessToken } from '@src/services/jwtServices';
import ApiResponse from '@src/utils/ApiResponse';
import { catchAsyncError } from '@src/utils/catchAsyncError';
import { Request, Response } from 'express';

const SignupUser = catchAsyncError(async (req: Request<object, object, SignupRequestBody>, res: Response) => {
  const { first_name, last_name, email, password } = req.body;
  // check if email already exists or not
  const user = await prisma.user.create({ data: { first_name, last_name, email, password } });
  console.log(user);
  // Give access token to the user
  const accessToken = await generateAccessToken({ id: '12', email: 'adsasdas', name: "adad" });
  return res.send(ApiResponse.success({ accessToken }, 'User created successfully', 201));
});

export { SignupUser };
