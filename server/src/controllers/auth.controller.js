import bcrypt from "bcryptjs";
import Users from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, password, email } = req.body;

    try {
        // check missing fields
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // check password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // check if user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new Users({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(res, newUser);
            await newUser.save();
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        generateToken(res, user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
        });

        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ success: false, message: "Profile pic is required" });
        }

        const uploadedResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            {
                profilePic: uploadedResponse.secure_url,
            },
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedUser, message: "User Profile image updated successfully" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error on update Profile",
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error on Check Auth",
        });
    }
};
