import { CreateRatingRequestBody, CreateRatingRequestParam, JwtUser } from "@src/Types";
import { createRating } from "@src/models/RatingModel";
import ApiResponse from "@src/utils/ApiResponse";
import { catchAsyncError } from "@src/utils/catchAsyncError";
import { Request, Response } from "express";

const CreateRestaurantRating = catchAsyncError(async (req: Request<CreateRatingRequestParam, any,
  CreateRatingRequestBody>, res: Response) => {
  const user = req.user as JwtUser;
  const { review, rating } = req.body;
  const { restaurantId } = req.params;
  const userId = user.id;

  await createRating({ review, rating, restaurantId: Number(restaurantId) as number, userId });

  return res.send(ApiResponse.success("Rating created successfully"));
});

export { CreateRestaurantRating };
