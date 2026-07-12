export interface ChatStateProps {
    messages: any[];
    users: any[];
    selectedUser: null | any;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;

    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (messageData: any) => Promise<void>;
    subscribeToMessages: () => Promise<void>;
    unsubscribeFromMessages: () => Promise<void>;
    setSelectedUser: (selectedUser: any) => void;
}
