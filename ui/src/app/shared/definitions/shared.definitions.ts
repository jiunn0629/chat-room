export interface DefaultRes<T> {
    isSuccess: boolean;
    message: string;
    data: T
}

export interface User {
    id: string;
    email: string;
    username: string;
    photo: any;
    status: string;
}

export interface CreateChatRoom {
    membersID: string[];
    type: string;
    name?: string;
    photo?: any;
}

export interface ChatRoom {
    id: string;
    name: string;
    type: string;
    photo: string;
    message: Message[];
    members: Member[];
    lastModify: number;
}

export interface Member {
    id: string;
    name: string;
    photo: any;
}

export interface WsMessage {
    senderId: string;
    chatRoomId: string;
    content: string;
}

export interface Message {
    senderId: string;
    chatRoomId: string;
    content: string;
    timestamp: number;
}