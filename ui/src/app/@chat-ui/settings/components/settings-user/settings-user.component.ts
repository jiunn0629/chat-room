import {Component, Input} from '@angular/core';
import {User} from "../../../../shared/definitions/shared.definitions";

@Component({
    selector: 'app-settings-user',
    templateUrl: './settings-user.component.html',
    styleUrls: ['./settings-user.component.scss']
})
export class SettingsUserComponent  {
    public isEdit: boolean = false;
    @Input() user: User | undefined;

    public onToggleEdit() {
        this.isEdit = !this.isEdit;
    }

}
