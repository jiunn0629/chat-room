import {Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {WsService} from "../../../core/services/ws.service";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {ChatRoom, Message} from "../../../shared/definitions/shared.definitions";
import {ChatRoomService} from "../../../shared/services/chat-room.service";

@Component({
    selector: 'app-chat-room-mgt',
    templateUrl: './chat-room-mgt.component.html',
    styleUrls: ['./chat-room-mgt.component.scss']
})
export class ChatRoomMgtComponent implements OnChanges {
    private chatRoomServie: ChatRoomService = inject(ChatRoomService);
    public message$: BehaviorSubject<Message[]> | undefined;
    @Input() chatRoom: ChatRoom | undefined;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['chatRoom'] && changes['chatRoom'].currentValue.id) {
            this.message$ = this.chatRoomServie.chatRoomMessageMap.get(changes['chatRoom'].currentValue.id);
        }
    }

}
