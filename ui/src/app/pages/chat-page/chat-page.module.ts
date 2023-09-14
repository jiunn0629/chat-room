import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatPageComponent} from './chat-page.component';
import {ChatPageRoutingModule} from "./chat-page-routing.module";
import {FriendsModule} from "../../@chat-ui/friends/friends.module";
import {ChatRoomModule} from "../../@chat-ui/chat-room/chat-room.module";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
    declarations: [
        ChatPageComponent
    ],
    imports: [
        CommonModule,
        ChatPageRoutingModule,
        FriendsModule,
        ChatRoomModule,
        SharedModule
    ]
})
export class ChatPageModule {
}
