import Users from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await Users.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");

        res.status(200).json({ success: true, data: filteredUsers });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: partnerId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                {
                    senderId: senderId,
                    receiverId: partnerId,
                },
                {
                    senderId: partnerId,
                    receiverId: senderId,
                },
            ],
        });

        res.status(200).json({
            success: true,
            data: messages,
            message: "get messages successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get message",
            error: error.message,
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: partnerId } = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId: partnerId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // real time function
        const receiverSocketId = getReceiverSocketId(partnerId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({
            success: true,
            message: "Message sended",
            data: newMessage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message,
        });
    }
};
