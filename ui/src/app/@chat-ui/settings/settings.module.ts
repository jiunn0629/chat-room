import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SettingsProfileComponent} from "./components/settings-profile/settings-profile.component";
import {HttpClientModule} from "@angular/common/http";
import {SettingService} from "./services/setting.service";
import {SettingsUserComponent} from './components/settings-user/settings-user.component';
import {SharedModule} from "../../shared/shared.module";
import {ProfilePhotoNameComponent} from "../standalone/profile-photo-name/profile-photo-name.component";


@NgModule({
    declarations: [
        SettingsProfileComponent,
        SettingsUserComponent,
    ],
    imports: [
        CommonModule,
        NgOptimizedImage,
        HttpClientModule,
        SharedModule,
        ProfilePhotoNameComponent
    ],
    exports: [
        SettingsProfileComponent,
        SettingsUserComponent
    ],
    providers: [
        SettingService
    ]
})
export class SettingsModule {
}
