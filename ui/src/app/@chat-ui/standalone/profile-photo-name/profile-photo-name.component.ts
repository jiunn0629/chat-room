import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {User} from "../../../shared/definitions/shared.definitions";

@Component({
    selector: 'app-profile-photo-name',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile-photo-name.component.html',
    styleUrls: ['./profile-photo-name.component.scss']
})
export class ProfilePhotoNameComponent implements OnChanges {
    @Input() name: string | undefined;
    @Input() photoWH: {width: number, height:number , fontSize: number} | undefined;
    @ViewChild('profilePhoto', {static: false}) profilePhoto: ElementRef | undefined;
    @ViewChild('profileName', {static: false}) profileName: ElementRef | undefined;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['name']) {
            setTimeout(() => {
                this.onSetProfilePhotoName(changes['name'].currentValue);
            },)
        }
        if (changes['photoWH']) {
            setTimeout(() => {
                this.onSetProfilePhotoWH(changes['photoWH'].currentValue)
            },)
        }
    }

    private onSetProfilePhotoName(name: string) {
        const profileName = (name.charAt(0) + '' + name.charAt(1)).toUpperCase();
        if (this.profileName) {
            this.profileName.nativeElement.innerHTML = profileName;
        }
    }

    private onSetProfilePhotoWH(style: {width: number, height:number , fontSize: number}) {
        if (this.profilePhoto) {
            this.profilePhoto.nativeElement.style.width = style.width + 'px';
            this.profilePhoto.nativeElement.style.height = style.height + 'px';
        }
        if (this.profileName) {
            this.profileName.nativeElement.style.width = style.width + 'px';
            this.profileName.nativeElement.style.height = style.height + 'px';
            this.profileName.nativeElement.style.lineHeight = style.height + 'px';
            this.profileName.nativeElement.style.fontSize = style.fontSize + 'px';
        }
    }
}
