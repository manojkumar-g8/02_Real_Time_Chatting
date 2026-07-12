import { create } from "zustand";
import type { ChatStateProps } from "../types/store/useChat.types";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./useAuth.store";

export const useChat = create<ChatStateProps>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        try {
            set({ isUsersLoading: true });
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data.data });
        } catch (error: any) {
            toast.error(error.message.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        try {
            set({ isMessagesLoading: true });
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data.data });
        } catch (error: any) {
            toast.error(error.message.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        console.log(selectedUser, messages);

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );
            set({ messages: [...messages, res.data.data] });
        } catch (error: any) {
            toast.error(error.message.data.message);
        }
    },

    subscribeToMessages: async () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuth.getState().socket;

        socket.on("newMessage", (newMessage: any) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: async () => {
        const socket = useAuth.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
