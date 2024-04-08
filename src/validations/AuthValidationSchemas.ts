export const signupSchema = {
  first_name: {
    isString: true,
    notEmpty: true,
    errorMessage: "First name is required",
  },
  last_name: {
    isString: true,
    notEmpty: true,
    errorMessage: "Last name is required",
  },
  email: {
    isEmail: true,
    errorMessage: "Invalid Email",
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be 8 characters",
    },
  },
};
