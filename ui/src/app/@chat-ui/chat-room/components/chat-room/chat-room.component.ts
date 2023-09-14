import {
    AfterViewChecked,
    Component,
    ElementRef, HostListener,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {WsService} from "../../../../core/services/ws.service";
import {ChatRoom, Member, Message, WsMessage} from "../../../../shared/definitions/shared.definitions";
import {BehaviorSubject} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";
import {ChatRoomService} from "../../../../shared/services/chat-room.service";

@Component({
    selector: 'app-chat-room',
    templateUrl: './chat-room.component.html',
    styleUrls: ['./chat-room.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({opacity: 0}),
                animate('300ms', style({opacity: 1})),
            ]),
        ]),
    ],
})
export class ChatRoomComponent implements OnChanges, AfterViewChecked {
    private wsService: WsService = inject(WsService);
    public userID: string = localStorage.getItem('userID')!;
    public membersMap: Map<string, Member> = new Map();
    public isComposing: boolean = false;
    public shouldSend: boolean = true;
    @Input() chatRoom: ChatRoom | undefined;
    @Input() message$: BehaviorSubject<Message[]> | undefined;
    @Input() members: Member[] | undefined;
    @ViewChild('dialogue', {static: false}) dialogue: ElementRef | undefined;
    @ViewChild('message', {static: false}) messageInput: ElementRef | undefined;

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.shiftKey) {
            this.shouldSend = true;
        }

        if (event.getModifierState('CapsLock')) {
            setTimeout(() => {
                this.shouldSend = true;
                this.isComposing = false;
            },500)

        }

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['members']) {
            changes['members'].currentValue.forEach((member: Member) => {
                this.membersMap.set(member.id, member);
            });
        }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    public onSendMessage(message: string) {
        if (message.length === 0) {
            return;
        }
        if (!this.isComposing && this.chatRoom) {
            const wsMessage: WsMessage = {
                senderId: localStorage.getItem('userID')!,
                chatRoomId: this.chatRoom.id,
                content:  message
            }
            this.wsService.sendMessage(wsMessage);

        }
        this.messageInput!.nativeElement.value = '';
    }

    private scrollToBottom() {
        if (this.dialogue) {
            this.dialogue.nativeElement!.scrollTop = this.dialogue.nativeElement.scrollHeight;
        }
    }

}
