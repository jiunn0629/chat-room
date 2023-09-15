import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FriendsAddComponent} from "../../@chat-ui/friends/components/friends-add/friends-add.component";
import {first} from "rxjs";
import {GroupAddComponent} from "../../@chat-ui/friends/components/group-add/group-add.component";
import {FriendsListComponent} from "../../@chat-ui/friends/components/friends-list/friends-list.component";
import {SendListComponent} from "../../@chat-ui/friends/components/send-list/send-list.component";
import {PendingListComponent} from "../../@chat-ui/friends/components/pending-list/pending-list.component";
import {UserService} from "../../shared/services/user.service";
import {ChatRoom, User} from "../../shared/definitions/shared.definitions";
import {FriendsService} from "../../@chat-ui/friends/services/friends.service";
import {AddFriendRes} from "../../@chat-ui/friends/defitiions/friends-defition";
import {SnackbarService} from "../../shared/services/snackbar.service";

@Component({
    selector: 'app-friends-page',
    templateUrl: './friends-page.component.html',
    styleUrls: ['./friends-page.component.scss']
})
export class FriendsPageComponent implements OnInit {
    public user: User | undefined;
    public friendsList: AddFriendRes[] = [];
    public sendList: AddFriendRes[] = [];
    public pendingList: AddFriendRes[] = [];
    public groupList: ChatRoom[] = [];
    private userService: UserService = inject(UserService);
    private friendsService: FriendsService = inject(FriendsService);
    private snackbarService: SnackbarService = inject(SnackbarService);
    @ViewChild('sendListComponent', {static: false}) sendListComponent: SendListComponent | undefined;
    @ViewChild('pendingListComponent', {static: false}) pendingListComponent: PendingListComponent | undefined;
    @ViewChild('friendsListComponent', {static: false}) friendsListComponent: FriendsListComponent | undefined;

    constructor(
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.onGetUser();
        this.onGetFriends();
        this.onGetSends();
        this.onGetPending();
        this.onGetGroup();
    }

    private onGetUser() {
        this.userService.getUser().pipe(first()).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.user = res.data;
                } else {
                    this.snackbarService.open(res.message,'ok',this.snackbarService.snackbarErrorConfig);
                }
            },
            error: err => {
                console.log(err);
            }
        })
    }

    public onGetFriends() {
        this.friendsService.getFriends('confirm').pipe(first()).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.friendsList = res.data ? res.data : [];
                } else {
                    this.snackbarService.open(res.message,'ok',this.snackbarService.snackbarErrorConfig);
                }
            },
            error: err => {
                console.log(err);
            }
        });
    }

    public onGetSends() {
        this.friendsService.getFriends('send').pipe(first()).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.sendList = res.data ? res.data : [];
                } else {
                    this.snackbarService.open(res.message,'ok',this.snackbarService.snackbarErrorConfig);
                }
            },
            error: err => {
                console.log(err);
            }
        });
    }

    public onGetPending() {
        this.friendsService.getFriends('pending').pipe(first()).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.pendingList = res.data ? res.data : [];
                } else {
                    this.snackbarService.open(res.message,'ok',this.snackbarService.snackbarErrorConfig);
                }
            },
            error: err => {
                console.log(err);
            }
        });
    }

    public onGetGroup() {
        this.friendsService.getGroup().pipe(first()).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.groupList = res.data ? res.data : [];
                } else {
                    this.snackbarService.open(res.message,'ok',this.snackbarService.snackbarErrorConfig);
                }
            },
            error: err => {
                console.log(err);
            }
        })
    }

    public onRefresh() {
        this.onGetSends();
        this.onGetFriends();
        this.onGetPending();
    }

    public onOpenAddFriendDialog() {
        const dialogRef = this.dialog.open(FriendsAddComponent, {
            hasBackdrop: true,
            backdropClass: 'backdropClass',
            panelClass: 'add-dialog'
        });

        dialogRef.afterClosed().pipe(first()).subscribe(result => {
            if (result.refresh) {
                this.onGetSends();
            }
        });
    }

    public onOpenAddGroupDialog() {
        const dialogRef = this.dialog.open(GroupAddComponent, {
            hasBackdrop: true,
            backdropClass: 'backdropClass',
            panelClass: 'add-dialog',
            data: {friendsList: this.friendsList}
        });

        dialogRef.afterClosed().pipe(first()).subscribe(result => {
            if (result.refresh) {
                this.onGetGroup();
            }
        })
    }

}
