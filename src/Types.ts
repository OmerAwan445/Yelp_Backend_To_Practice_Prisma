export interface CustomError extends Error {
    statusCode: number;
}

export interface JwtUser {
    id: number
    email: string;
    name: string;
}

export interface SignupRequestBody {
    first_name: string
    last_name: string
    email: string
    password: string;
    confirm_password: string;
  }
