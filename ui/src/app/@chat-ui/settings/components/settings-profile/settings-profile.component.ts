import {
    Component,
    inject,
    Input,
    OnInit,
} from '@angular/core';
import {SettingService} from "../../services/setting.service";
import {ToastService} from "../../../../shared/services/toast.service";
import {User} from "../../../../shared/definitions/shared.definitions";

@Component({
    selector: 'app-settings-profile',
    templateUrl: './settings-profile.component.html',
    styleUrls: ['./settings-profile.component.scss']
})
export class SettingsProfileComponent implements OnInit {
    private settingService: SettingService = inject(SettingService);
    private toastService: ToastService = inject(ToastService);
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
                    this.toastService.showSuccess({title: '成功', text: res.message});
                    // this.onGetUserPhoto();
                } else {
                    this.toastService.showError({title: '失敗', text: res.message});
                }
            },
            error: err => {
                console.log(err);
            }
        })
    }
}
