import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FriendsProfileComponent} from './components/friends-profile/friends-profile.component';
import {FriendsAddComponent} from './components/friends-add/friends-add.component';
import {GroupAddComponent} from './components/group-add/group-add.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {FriendsService} from "./services/friends.service";
import {SendListComponent} from './components/send-list/send-list.component';
import {FriendsListComponent} from './components/friends-list/friends-list.component';
import {PendingListComponent} from './components/pending-list/pending-list.component';
import {GroupsListComponent} from './components/groups-list/groups-list.component';
import {FriendsConfirmComponent} from './components/friends-confirm/friends-confirm.component';
import {SharedModule} from "../../shared/shared.module";
import {ProfilePhotoNameComponent} from "../standalone/profile-photo-name/profile-photo-name.component";
import {ListBoxComponent} from "../standalone/list-box/list-box.component";


@NgModule({
    declarations: [
        FriendsProfileComponent,
        FriendsAddComponent,
        GroupAddComponent,
        SendListComponent,
        FriendsListComponent,
        PendingListComponent,
        GroupsListComponent,
        FriendsConfirmComponent
    ],
    imports: [
        CommonModule,
        NgOptimizedImage,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule,
        ProfilePhotoNameComponent,
        ListBoxComponent
    ],
    exports: [
        SendListComponent,
        FriendsListComponent,
        PendingListComponent,
        GroupsListComponent,
        GroupAddComponent
    ],
    providers: [
        FriendsService
    ]
})
export class FriendsModule {
}
