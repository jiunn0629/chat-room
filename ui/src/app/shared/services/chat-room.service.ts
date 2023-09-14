import {inject, Injectable} from '@angular/core';
import {RESOURCE_URLS_TOKEN, ResourceUrls} from "../providers/resource-url-provider";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ChatRoom, CreateChatRoom, DefaultRes, Message} from "../definitions/shared.definitions";
import {BehaviorSubject, map, retry} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ChatRoomService {
    public chatRoomIsOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public chatRoom$: BehaviorSubject<ChatRoom | undefined> = new BehaviorSubject<ChatRoom | undefined>(undefined);
    public selectChatRoomId$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public chatRoomList$: BehaviorSubject<ChatRoom[]> = new BehaviorSubject<ChatRoom[]>([]);
    public chatRoomMessageMap: Map<string,BehaviorSubject<Message[]>> = new Map();
    private resourceURLs: ResourceUrls = inject(RESOURCE_URLS_TOKEN);

    constructor(
        private http: HttpClient
    ) {
    }

    public setChatRoomToggle(isOpen: boolean) {
        this.chatRoomIsOpen$.next(isOpen);
    }

    public setChatRoom(chatRoom: ChatRoom) {
        this.chatRoom$.next(chatRoom);
    }

    public setSelectChatRoomId$(chatRoomId: string) {
        this.selectChatRoomId$.next(chatRoomId);
    }

    public checkIfChatRoomInList(chatRoomId: string) {
        return this.chatRoomList$.getValue().find(chatRoom => {return chatRoom.id === chatRoomId});
    }

    public appendChatRoomList(chatRoom: ChatRoom) {
        const newList = [...this.chatRoomList$.getValue(),chatRoom];
        this.chatRoomList$.next(newList);
    }

    public setChatRoomLastModify(chatRoomId: string, lastModify: number) {
        const list = this.chatRoomList$.getValue();
        const chatRoom = list.find(chatRoom => {return chatRoom.id === chatRoomId});
        if (chatRoom) {
            chatRoom.lastModify = lastModify;
        }
    }

    public createChatRoom(data: CreateChatRoom) {
        const url = this.resourceURLs.chatRooms;
        return this.http.post<DefaultRes<null>>(url, data);
    }

    public getChatRoom(chatRoomId: string) {
        const url = this.resourceURLs.chatRoom.replace('{chatRoomId}',chatRoomId);
        const options = {
            params: new HttpParams().set('userId', localStorage.getItem('userID')!)
        };
        return this.http.get<DefaultRes<ChatRoom>>(url, options);
    }

    public getChatRooms() {
        const url = this.resourceURLs.chatRooms;
        const options = {
            params: new HttpParams().set('userId', localStorage.getItem('userID')!)
        }
        return this.http.get<DefaultRes<ChatRoom[]>>(url,options);
    }

    public getChatRoomMessage(chatRoomId: string) {
        const url = this.resourceURLs.chatRoomMessage.replace('{chatRoomId}', chatRoomId);
        const options = {
            params: new HttpParams().set('userId', localStorage.getItem('userID')!)
        }
        return this.http.get<DefaultRes<Message[]>>(url,options);
    }

    public getChatRoomByUserIdFriendId(userId: string, friendId: string) {
        const url = this.resourceURLs.getChatRoomByUserIdFriendId.replace('{userId}', userId).replace('{friendId}',friendId);
        return this.http.get<DefaultRes<string>>(url);
    }


}
