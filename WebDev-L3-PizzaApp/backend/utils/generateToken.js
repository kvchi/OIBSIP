import crypto from "crypto";

// Generates a random hex string, used for email verification and password reset tokens
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export default generateToken;