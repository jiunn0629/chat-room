import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {WsService} from "../core/services/ws.service";
import {ChatRoomService} from "../shared/services/chat-room.service";
import {BehaviorSubject, first, map, Subject, takeUntil} from "rxjs";
import {ChatRoom, Message} from "../shared/definitions/shared.definitions";

@Component({
    selector: 'app-pages',
    template: `
        <app-layout>
            <app-menu></app-menu>
            <router-outlet></router-outlet>
            <app-chat-room-page [chatRoom]="chatRoom"></app-chat-room-page>
        </app-layout>
    `
})
export class PagesComponent implements OnInit, OnDestroy {
    private wsService: WsService = inject(WsService);
    private chatRoomService: ChatRoomService = inject(ChatRoomService);
    private destroy$: Subject<void> = new Subject<void>();
    public chatRoom: ChatRoom | undefined;

    ngOnInit(): void {
        this.wsService.onConnect({userId: localStorage.getItem('userID')});
        this.chatRoomService.chatRoom$.pipe(takeUntil(this.destroy$)).subscribe(chatroom => {
            this.chatRoom = chatroom;
        });
        this.onGetChatRooms();
    }

    private onGetChatRooms() {
        this.chatRoomService.getChatRooms().pipe(
            first(),
            map(res => {
                res.data.forEach(chatRoom => {
                    this.onGetChatRoomMessage(chatRoom.id);
                });
                return res
            })
        ).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.chatRoomService.chatRoomList$.next(res.data);
                }
            },
            error: err => {
                console.log(err);
            }
        })
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

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
