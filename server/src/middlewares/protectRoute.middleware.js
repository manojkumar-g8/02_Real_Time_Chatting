import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Users.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({
            message: "Not authorized, token failed or expired",
        });
    }
};
