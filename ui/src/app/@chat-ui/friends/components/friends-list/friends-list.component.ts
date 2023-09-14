import {Component, inject, Input, OnInit} from '@angular/core';
import {AddFriendRes} from "../../defitiions/friends-defition";
import {first} from "rxjs";
import {ChatRoomService} from "../../../../shared/services/chat-room.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-friends-list',
    templateUrl: './friends-list.component.html',
    styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent {
    private chatRoomService: ChatRoomService = inject(ChatRoomService);
    private router: Router = inject(Router);
    @Input() friendsList: AddFriendRes[] = [];

    public onGetChatRoomByUserIdFriendId(user: AddFriendRes) {
        this.chatRoomService.getChatRoomByUserIdFriendId(localStorage.getItem('userID')!, user.id).pipe(first()).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.chatRoomService.setSelectChatRoomId$(res.data);
                    this.router.navigate(['pages/chats']);
                }
            }
        })
    }

    // public onCreateChatRoom(user: AddFriendRes) {
    //     const data: CreateChatRoom = {
    //         membersID: [user.id, localStorage.getItem('userID')!],
    //         type: 'private'
    //     }
    //     this.chatRoomService.createChatRoom(data).pipe(first()).subscribe({
    //         next: res => {
    //             if (res.isSuccess) {
    //
    //             }
    //         },
    //         error: err => {
    //             console.log(err)
    //         }
    //     })
    // }
}
