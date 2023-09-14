import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatRoomService} from "../../shared/services/chat-room.service";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {ChatRoom, Message} from "../../shared/definitions/shared.definitions";
import {WsService} from "../../core/services/ws.service";

@Component({
    selector: 'app-chat-room-page',
    templateUrl: './chat-room-page.component.html',
    styleUrls: ['./chat-room-page.component.scss']
})
export class ChatRoomPageComponent implements OnInit, OnDestroy {
    private wsService: WsService = inject(WsService);
    private chatRoomService: ChatRoomService = inject(ChatRoomService);
    private destroy$: Subject<void> = new Subject<void>();
    public isOpen$: BehaviorSubject<boolean> = this.chatRoomService.chatRoomIsOpen$;
    @Input() chatRoom: ChatRoom | undefined;

    ngOnInit() {
        this.wsService.getMessage().pipe(takeUntil(this.destroy$)).subscribe((msg: Message) => {
            const messages = this.chatRoomService.chatRoomMessageMap.get(msg.chatRoomId)?.getValue();
            if (messages) {
                this.chatRoomService.chatRoomMessageMap.get(msg.chatRoomId)?.next([...messages,msg]);
                this.chatRoomService.setChatRoomLastModify(msg.chatRoomId, msg.timestamp);
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
