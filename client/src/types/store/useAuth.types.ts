export type UserDataProps = {
    fullName: string;
    email: string;
    password: string;
};

export type LoginProps = {
    email: string;
    password: string;
};
export type UpdateProfileProps = {
    profilePic: ArrayBuffer | string;
};

export interface AuthStateProps {
    authUser: any | null;
    isSigningUp: boolean;
    isUpdatingProfile: boolean;
    isLoggingIn: boolean;
    isCheckingAuth: boolean;
    onlineUsers: any[];
    socket: any;

    checkAuth: () => Promise<void>;
    signup: (data: UserDataProps) => Promise<void>;
    login: (data: LoginProps) => Promise<void>;
    updateProfile: (data: UpdateProfileProps) => Promise<void>;
    logout: () => Promise<void>;
    connectSocket: () => Promise<void>;
    disConnectSocket: () => Promise<void>;
}
