import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import generateJWT from "../utils/generateJWT.js";
import sendEmail from "../utils/sendEmail.js";

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body || {};

  // Basic validation - required fields check
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
    }

    //Generate a verification token before creating the user
    const verificationToken = generateToken();

    //Create a user - password gets hashed automatically via the pre("save") hook in the User model
    const user = await User.create({
         name,
         email, 
         password,
        verificationToken
     });

     // TODO: send verification email once Nodemailer is configured
     const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

     await sendEmail(
        email,
        "Verify your email for Pizza Delivery App",
        `<p>Hi ${name},</p>
        <p>Thank you for registering on our Pizza Delivery App. Please click the link below to verify your email address:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>If you did not register, please ignore this email.</p>`
    );

     res.status(201).json({ 
        message: "User registered successfully. Please check your email to verify your account.",
        userId: user._id,});
}

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateJWT(user._id, user.role);
    res.status(200).json({ 
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        },
    });
};

// @route GET /api/auth/verify-email/:token
export const verifyEmail = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
};

// @route POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
    const { email } = req.body || {};

    if (!email) {
        return res.status(400).json({ message: "Please provide an email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(200).json({ message: "If an account with that email exists, a reset link has been sent." });
    }

    // Generate a password reset token and set an expiration time
    const resetToken = generateToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 *60 * 1000; // 1 hour
    await user.save();

    //TODO: send reset email once Nodemailer is configured
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
        email,
        "Password Reset Request for Pizza Delivery App",
        `<p>Hi ${user.name},</p>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>`
    );

    res.status(200).json({ message: "If an account with that email exists, a reset link has been sent." });
};

// @route POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body || {};

    if (!newPassword) {
        return res.status(400).json({ message: "Please provide a new password" });
    }

    const user = await User.findOne({ 
        resetPasswordToken: token, 
        resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired password reset token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });
};