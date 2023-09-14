import {Component, inject, OnInit} from '@angular/core';
import {ChatRoomService} from "../../../../shared/services/chat-room.service";
import {BehaviorSubject, first, map} from "rxjs";
import {ChatRoom, Message} from "../../../../shared/definitions/shared.definitions";

@Component({
    selector: 'app-chat-room-list',
    templateUrl: './chat-room-list.component.html',
    styleUrls: ['./chat-room-list.component.scss']
})
export class ChatRoomListComponent implements OnInit{
    public chatRoomService: ChatRoomService = inject(ChatRoomService);

    ngOnInit(): void {
        if (this.chatRoomService.selectChatRoomId$.getValue()) {
            const selectChatRoom = this.chatRoomService.chatRoomList$.getValue().find(chatRoom => {
                return chatRoom.id === this.chatRoomService.selectChatRoomId$.getValue();
            });
            if (selectChatRoom) {
                this.chatRoomService.setChatRoom(selectChatRoom);
                this.chatRoomService.setChatRoomToggle(true);
            }
        }
        if(this.chatRoomService.selectChatRoomId$.getValue() && !this.chatRoomService.checkIfChatRoomInList(this.chatRoomService.selectChatRoomId$.getValue())) {
            this.onGetChatRoom();
        }
    }

    private onGetChatRoom() {
        this.chatRoomService.getChatRoom(this.chatRoomService.selectChatRoomId$.getValue()).pipe(first()).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.chatRoomService.appendChatRoomList(res.data);
                    this.chatRoomService.setChatRoom(res.data);
                    this.onGetChatRoomMessage(res.data.id);
                }
            },
            error: err => {
                console.log(err);
            }
        });
    }

    private onGetChatRoomMessage(chatRoomId: string) {
        this.chatRoomService.getChatRoomMessage(chatRoomId).pipe(first()).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.chatRoomService.chatRoomMessageMap.set(chatRoomId, new BehaviorSubject<Message[]>(res.data ? res.data : []));
                }
            },
            error: err => {
                console.log(err);
            }
        })
    }

    public onSelectChatRoom(chatRoom: ChatRoom) {
        this.chatRoomService.setChatRoomToggle(true);
        this.chatRoomService.setChatRoom(chatRoom)
    }

}
