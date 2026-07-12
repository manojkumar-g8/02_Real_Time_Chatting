import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { AuthStateProps } from "../types/store/useAuth.types";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000/";

export const useAuth = create<AuthStateProps>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isLoggingIn: false,
  onlineUsers: [],
  socket: null,

  // send the cookie and check the user auth or not
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.data });
      get().connectSocket();
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // register new user
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.data });
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // login user
  login: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.data });
      toast.success("Logged in successful");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.message.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // update profile
  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put("auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Update Profile image successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // logout user
  logout: async () => {
    try {
      await axiosInstance.post("auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disConnectSocket();
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  },

  // connect socket
  connectSocket: async () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // disconnect socket
  disConnectSocket: async () => {
    if (get().socket?.connected()) {
      get().socket?.disconnect();
    }
  },
}));
