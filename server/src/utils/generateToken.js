import jwt from "jsonwebtoken";
export const generateToken = async (res, user) => {
    const token = jwt.sign(
        { userId: user._id, fullName: user.fullName },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        },
    );

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSit: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
};
