import jwt from "jsonwebtoken";

const generateJWT = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export default generateJWT;