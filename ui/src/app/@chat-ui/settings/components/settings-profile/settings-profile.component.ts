import {
    Component,
    inject,
    Input,
    OnInit,
} from '@angular/core';
import {SettingService} from "../../services/setting.service";
import {User} from "../../../../shared/definitions/shared.definitions";
import {SnackbarService} from "../../../../shared/services/snackbar.service";

@Component({
    selector: 'app-settings-profile',
    templateUrl: './settings-profile.component.html',
    styleUrls: ['./settings-profile.component.scss']
})
export class SettingsProfileComponent implements OnInit {
    private settingService: SettingService = inject(SettingService);
    private snackbarService: SnackbarService = inject(SnackbarService);
    @Input() user: User | undefined;



    ngOnInit() {
        // this.onGetUserPhoto();
    }

    // private onGetUserPhoto() {
    //     this.settingService.getUserPhoto(localStorage.getItem('userID')!).subscribe({
    //         next: imageData => {
    //             const reader = new FileReader();
    //             reader.onload = () => {
    //                 this.imageSrc = reader.result ? reader.result : '../../../assets/images/user.png';
    //             }
    //             reader.readAsDataURL(imageData);
    //         },
    //         error: err => {
    //             console.log(err)
    //         }
    //     })
    // }

    public onUploadUserPhoto(event: any) {
        const photo = event.target.files[0];
        if (!photo) {
            return;
        }
        this.settingService.uploadUserPhoto(localStorage.getItem('userID')!, photo).subscribe({
            next: res => {
                if (res.isSuccess) {
                    this.snackbarService.open(res.message,'',this.snackbarService.snackbarSuccessConfig);
                    // this.onGetUserPhoto();
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
