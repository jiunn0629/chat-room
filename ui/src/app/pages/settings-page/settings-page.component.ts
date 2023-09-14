import {Component, inject, OnInit} from '@angular/core';
import {first} from "rxjs";
import {User} from "../../shared/definitions/shared.definitions";
import {ToastService} from "../../shared/services/toast.service";
import {UserService} from "../../shared/services/user.service";

@Component({
    selector: 'app-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
    public user: User | undefined;
    private toastService: ToastService = inject(ToastService);
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
                    this.toastService.showError({title: '錯誤', text: res.message});
                }
            },
            error: err => {
                console.log(err);
            }
        })
    }
}
