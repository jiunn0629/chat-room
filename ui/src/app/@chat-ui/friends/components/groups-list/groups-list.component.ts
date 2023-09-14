import {Component, inject, Input} from '@angular/core';
import {ChatRoom} from "../../../../shared/definitions/shared.definitions";
import {ChatRoomService} from "../../../../shared/services/chat-room.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-groups-list',
    templateUrl: './groups-list.component.html',
    styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent {
    private chatRoomService: ChatRoomService = inject(ChatRoomService);
    private router: Router = inject(Router);
    @Input() groupList: ChatRoom[] = [];

    onNavigateToChat(group: ChatRoom) {
        this.chatRoomService.setSelectChatRoomId$(group.id);
        this.router.navigate(['pages/chats']);
    }
}
