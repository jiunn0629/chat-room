import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AddFriendRes} from "../../defitiions/friends-defition";
import {FriendsService} from "../../services/friends.service";
import {first, switchMap} from "rxjs";
import {ChatRoomService} from "../../../../shared/services/chat-room.service";
import {SnackbarService} from "../../../../shared/services/snackbar.service";

@Component({
    selector: 'app-friends-confirm',
    templateUrl: './friends-confirm.component.html',
    styleUrls: ['./friends-confirm.component.scss']
})
export class FriendsConfirmComponent {
    public imageSrc = '../../../assets/images/user.png';
    private friendService: FriendsService = inject(FriendsService);
    private chatRoomService: ChatRoomService = inject(ChatRoomService);
    private snackbarService: SnackbarService = inject(SnackbarService);
    private dialogRef: MatDialogRef<FriendsConfirmComponent> = inject(MatDialogRef);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { user: AddFriendRes },
    ) {
    }

    public onModifyFriendStatus(friend: AddFriendRes, invitationStatus: 'confirm' | 'refuse') {
        this.friendService.modifyFriendStatus(localStorage.getItem('userID')!, friend.id, invitationStatus).pipe(
            switchMap(res => {
                return this.chatRoomService.createChatRoom({
                    type:"private",
                    membersID: [friend.id,localStorage.getItem('userID')!],
                });
            }),
            first()
        ).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.snackbarService.open(res.message,'ok',this.snackbarService.snackbarSuccessConfig);
                    this.dialogRef.close({refresh: true});
                } else {
                    this.snackbarService.open(res.message,'ok',this.snackbarService.snackbarErrorConfig);
                }
            },
            error: err => {
                console.log(err);
            }
        })
    }
}
