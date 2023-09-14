import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatRoomWelcomeComponent} from './components/chat-room-welcome/chat-room-welcome.component';
import {ChatRoomComponent} from './components/chat-room/chat-room.component';
import {ChatRoomListComponent} from './components/chat-room-list/chat-room-list.component';
import {FriendsModule} from "../friends/friends.module";
import {SharedModule} from "../../shared/shared.module";
import {ProfilePhotoNameComponent} from "../standalone/profile-photo-name/profile-photo-name.component";
import {ListBoxComponent} from "../standalone/list-box/list-box.component";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {SkeletonLoaderComponent} from "../standalone/skeleton-loader/skeleton-loader.component";


@NgModule({
    declarations: [
        ChatRoomWelcomeComponent,
        ChatRoomComponent,
        ChatRoomListComponent,
    ],
    exports: [
        ChatRoomWelcomeComponent,
        ChatRoomComponent,
        ChatRoomListComponent
    ],
    imports: [
        CommonModule,
        FriendsModule,
        SharedModule,
        ProfilePhotoNameComponent,
        ListBoxComponent,
        NgxSkeletonLoaderModule,
        SkeletonLoaderComponent
    ]
})
export class ChatRoomModule {
}
