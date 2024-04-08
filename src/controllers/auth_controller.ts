import ApiResponse from '@src/utils/ApiResponse';
import { catchAsyncError } from '@src/utils/catchAsyncError';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

const SignupUser = catchAsyncError(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return res.send(ApiResponse.success([], 'User signed up successfully', 201));
});

export { SignupUser };
