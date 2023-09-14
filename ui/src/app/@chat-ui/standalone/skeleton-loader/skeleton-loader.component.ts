import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {ProfilePhotoNameComponent} from "../profile-photo-name/profile-photo-name.component";

@Component({
    selector: 'app-skeleton-loader',
    standalone: true,
    imports: [CommonModule, NgxSkeletonLoaderModule, ProfilePhotoNameComponent],
    templateUrl: './skeleton-loader.component.html',
    styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent {
}
