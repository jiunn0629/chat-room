import {Component, Input} from '@angular/core';
import {AddFriendRes} from "../../defitiions/friends-defition";

@Component({
    selector: 'app-send-list',
    templateUrl: './send-list.component.html',
    styleUrls: ['./send-list.component.scss']
})
export class SendListComponent {
    @Input() sendList: AddFriendRes[] = [];

}
