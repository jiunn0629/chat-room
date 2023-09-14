import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatRoom, Message, User} from "../../../shared/definitions/shared.definitions";
import {ProfilePhotoNameComponent} from "../profile-photo-name/profile-photo-name.component";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'app-list-box',
    standalone: true,
    imports: [CommonModule, ProfilePhotoNameComponent],
    templateUrl: './list-box.component.html',
    styleUrls: ['./list-box.component.scss']
})
export class ListBoxComponent {
    @Input() user: User | undefined;
    @Input() group: ChatRoom | undefined;
    @Input() chatRoom: ChatRoom | undefined;
    @Input() selected: boolean = false;
    @Input() message$: BehaviorSubject<Message[]> | undefined = new BehaviorSubject<Message[]>([]);
    @Output() clickEvent: EventEmitter<User | ChatRoom> = new EventEmitter<User | ChatRoom>();

}
