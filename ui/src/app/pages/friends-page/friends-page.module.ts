import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FriendsPageComponent} from './friends-page.component';
import {FriendsPageRoutingModule} from "./friends-page-routing.module";
import {FriendsModule} from "../../@chat-ui/friends/friends.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {ListBoxComponent} from "../../@chat-ui/standalone/list-box/list-box.component";


@NgModule({
    declarations: [
        FriendsPageComponent
    ],
    imports: [
        CommonModule,
        FriendsPageRoutingModule,
        FriendsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ListBoxComponent
    ]
})
export class FriendsPageModule {
}
