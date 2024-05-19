import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


// ======= Global types ==========
declare module "jsonwebtoken" {
    export interface JwtPayload {
        user: JwtUser;
    }
}

// eslint-disable-next-line
declare global {
    // eslint-disable-next-line
    namespace Express {
        interface Request {
        user?: JwtUser; // Define the user property with the appropriate type
  }
}
  }

export type RatingsCreateData = Prisma.RatingsCreateArgs['data'];
export interface CustomError extends Error {
    statusCode: number;
}

export interface JwtUser {
    id: number
    email: string;
    name: string;
}

// Request Body Interfaces
export interface SignupRequestBody {
    first_name: string
    last_name: string
    email: string
    password: string;
    confirm_password: string;
}
export interface LoginRequestBody {
    email: string
    password: string;
}

export interface ResetPasswordRequestBody {
    token: string;
    password: string;
    confirm_password: string;
}

export interface EncryptedDataInToken {
    userId: number;
}

export interface CreateRatingRequestBody {
    review: string
    rating: Decimal
    restaurantId: number
}

export interface CreateRatingRequestParam {
    restaurantId?: number
 }
