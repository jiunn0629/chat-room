import {InjectionToken} from "@angular/core";

const baseUrl = 'http://localhost:8080';
const wsUrl = 'ws://localhost:8080';

export interface ResourceUrls {
    // auth service
    login: string;
    register: string;
    // friends service
    getUser: string;
    getFriends: string;
    modifyFriendStatus: string;
    getGroup: string;
    // setting service
    userPhoto: string;
    addFriend: string;
    // chatroom service
    chatRoom: string;
    chatRooms: string;
    chatRoomMessage: string;
    getChatRoomByUserIdFriendId: string;
    // ws service
    wsEndPoint: string;
}

export const ResourceURLS: ResourceUrls = {
    // auth service
    login: `${baseUrl}/auth/login`,
    register: `${baseUrl}/user`,
    // friends service
    getUser: `${baseUrl}/user/{userId}`,
    getFriends: `${baseUrl}/user/{userId}/friends`,
    modifyFriendStatus: `${baseUrl}/user/{userId}/friends/{friendId}`,
    getGroup: `${baseUrl}/user/{userId}/groups`,
    // setting service
    userPhoto: `${baseUrl}/user/{userId}/photo`,
    addFriend: `${baseUrl}/user/{userId}/friend`,
    // chatroom service
    chatRoom: `${baseUrl}/chat-room/{chatRoomId}`,
    chatRooms: `${baseUrl}/chat-room`,
    chatRoomMessage: `${baseUrl}/chat-room/{chatRoomId}/message`,
    getChatRoomByUserIdFriendId: `${baseUrl}/chat-room/user/{userId}/friend/{friendId}`,
    // ws service
    wsEndPoint: `${wsUrl}/chat-room/ws`,
}

export const RESOURCE_URLS_TOKEN = new InjectionToken<ResourceUrls>('RESOURCE_URLS_TOKEN');
