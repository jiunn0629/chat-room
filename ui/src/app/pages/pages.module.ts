import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {LayoutModule} from "../layout/layout.module";
import {SettingsPageModule} from "./settings-page/settings-page.module";
import {ChatRoomPageModule} from "./chat-room-page/chat-room-page.module";
import {SharedModule} from "../shared/shared.module";


@NgModule({
    declarations: [
        PagesComponent,
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        LayoutModule,
        SettingsPageModule,
        ChatRoomPageModule,
        SharedModule
    ]
})
export class PagesModule {
}
