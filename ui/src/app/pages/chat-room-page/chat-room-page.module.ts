import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatRoomPageComponent} from './chat-room-page.component';
import {ChatRoomModule} from "../../@chat-ui/chat-room/chat-room.module";
import {ChatRoomMgtComponent} from './chat-room-mgt/chat-room-mgt.component';
import {RouterOutlet} from "@angular/router";
import {ChatRoomWelcomeMgtComponent} from './chat-room-welcome-mgt/chat-room-welcome-mgt.component';
import {SharedModule} from "../../shared/shared.module";



@NgModule({
    declarations: [
        ChatRoomPageComponent,
        ChatRoomMgtComponent,
        ChatRoomWelcomeMgtComponent
    ],
    imports: [
        CommonModule,
        ChatRoomModule,
        RouterOutlet,
        SharedModule
    ],
    exports: [
        ChatRoomPageComponent
    ]
})
export class ChatRoomPageModule {
}
