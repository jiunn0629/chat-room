import {Component, inject, OnInit} from '@angular/core';
import {first} from "rxjs";
import {User} from "../../shared/definitions/shared.definitions";
import {UserService} from "../../shared/services/user.service";
import {SnackbarService} from "../../shared/services/snackbar.service";

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
    public user: User | undefined;
    private snackbarService: SnackbarService = inject(SnackbarService);
    private userService: UserService = inject(UserService);

    ngOnInit() {
        this.onGetUser();
    }

    private onGetUser() {
        this.userService.getUser(localStorage.getItem('userID')!).pipe(first()).subscribe({
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
}
