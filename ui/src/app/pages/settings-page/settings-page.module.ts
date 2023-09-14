import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {SettingsPageRoutingModule} from './settings-page-routing.module';
import {SettingsPageComponent} from './settings-page.component';
import {SettingsModule} from "../../@chat-ui/settings/settings.module";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
    declarations: [
        SettingsPageComponent,
    ],
    imports: [
        CommonModule,
        SettingsPageRoutingModule,
        NgOptimizedImage,
        SettingsModule,
        SharedModule
    ],
})
export class SettingsPageModule {
}
