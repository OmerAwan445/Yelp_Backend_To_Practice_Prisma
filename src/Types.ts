
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
