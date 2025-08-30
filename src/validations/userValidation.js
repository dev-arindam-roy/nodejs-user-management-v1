const yup = require("yup");

const baseUserSchema = {
  first_name: yup.string(),
  last_name: yup.string(),
  email: yup.string().email("Invalid email"),
  username: yup.string().min(4, "Username must be at least 4 characters"),
  password: yup.string().min(6, "Password must be at least 6 characters"),
  gender: yup.mixed().oneOf(["male", "female", "other"], "Invalid gender"),
  address: yup.string().nullable(),
  status: yup.number().default(0),
};

// Create schema (all required except address & status)
const createUserSchema = yup.object().shape({
  ...baseUserSchema,
  first_name: baseUserSchema.first_name.required("First name is required"),
  last_name: baseUserSchema.last_name.required("Last name is required"),
  email: baseUserSchema.email.required("Email is required"),
  username: baseUserSchema.username.required("Username is required"),
  password: baseUserSchema.password.required("Password is required"),
  gender: baseUserSchema.gender.required("Gender is required"),
});

// Update schema (all optional, only validate what’s sent)
const updateUserSchema = yup.object().shape(baseUserSchema);

module.exports = { createUserSchema, updateUserSchema };
