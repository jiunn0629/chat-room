import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AddFriendRes} from "../../defitiions/friends-defition";
import {first} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {FriendsConfirmComponent} from "../friends-confirm/friends-confirm.component";

@Component({
    selector: 'app-pending-list',
    templateUrl: './pending-list.component.html',
    styleUrls: ['./pending-list.component.scss']
})
export class PendingListComponent {
    @Input() pendingList: AddFriendRes[] = [];
    @Output() refresh: EventEmitter<null> = new EventEmitter<null>();

    constructor(
        private dialog: MatDialog
    ) {
    }

    public onOpenConfirmFriendDialog(user: AddFriendRes) {
        const dialogRef = this.dialog.open(FriendsConfirmComponent, {
            hasBackdrop: true,
            backdropClass: 'backdropClass',
            panelClass: 'confirm-dialog',
            data: {user: user}
        });
        dialogRef.afterClosed().pipe(first()).subscribe(result => {
            if (result.refresh) {
                this.refresh.emit();
            }
        })
    }
}
