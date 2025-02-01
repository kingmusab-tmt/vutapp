import dbConnect from "@/lib/connectdb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { sendVerificationEmail } from "@/utils/mail";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

// Validation schema using yup
const userSchema = yup.object().shape({
  name: yup.string().required("Name is required").trim(),
  username: yup.string().required("Username is required").trim(),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .trim(),
  phoneNumber: yup
    .number()
    .typeError("Phone number must be a valid number")
    .required("Phone number is required")
    .integer("Phone number must be an integer")
    .positive("Phone number must be positive"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  bvnOrNin: yup
    .number()
    .typeError("BVN or NIN must be a valid number")
    .required("BVN or NIN is required")
    .integer("BVN or NIN must be an integer")
    .positive("BVN or NIN must be positive")
    .test(
      "len",
      "BVN or NIN must be exactly 11 digits",
      (val) => val?.toString().length === 11
    ),
  country: yup.string().required("Country is required").trim(),
  state: yup.string().required("State is required").trim(),
  lga: yup.string().required("LGA is required").trim(),
  address: yup.string().trim().optional(),
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, res: NextResponse) {
  await dbConnect();

  try {
    // Parse and validate the JSON request body
    const body = await req.json();

    try {
      await userSchema.validate(body, { abortEarly: false }); // Abort early is false to collect all errors
    } catch (validationError: unknown) {
      // Check if validationError is a yup.ValidationError instance
      if (validationError instanceof yup.ValidationError) {
        const errors = validationError.inner.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        return NextResponse.json(
          { message: "Validation failed", errors },
          { status: 400 }
        );
      }
      // Handle other unknown errors (not expected to happen with yup validation)
      return NextResponse.json(
        { message: "Unexpected validation error occurred" },
        { status: 400 }
      );
    }

    const {
      name,
      username,
      email,
      phoneNumber,
      password,
      bvnOrNin,
      country,
      state,
      lga,
      address,
    } = body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email or username." },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = uuidv4();

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      bvnOrNin,
      country,
      state,
      lga,
      address,
      dateOfRegistration: new Date(),
      remainingBalance: 0,
      emailToken: token,
      isActive: false,
      role: "User",
      image: null,
      lastLoginTime: null,
      favouriteProperties: [],
      totalPropertyPurchased: 0,
      totalPaymentMade: 0,
      nextPaymentDueDate: null,
      referralEarnings: 0,
      numberOfReferrals: 0,
      propertyPurchased: [],
      propertyUnderPayment: [],
      propertyRented: [],
    });

    // Save the user to the database and send verification email
    await newUser.save();
    await sendVerificationEmail(email, token);

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
