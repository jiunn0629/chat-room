import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RESOURCE_URLS_TOKEN} from "../../../shared/providers/resource-url-provider";
import {DefaultRes} from "../../../shared/definitions/shared.definitions";

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    private resourceURLs = inject(RESOURCE_URLS_TOKEN);

    constructor(
        private http: HttpClient,
    ) {
    }

    public getUserPhoto() {
        const url = this.resourceURLs.userPhoto;
        return this.http.get<Blob>(url, {responseType: 'blob' as 'json'});
    }

    public uploadUserPhoto(photo: File) {
        const url = this.resourceURLs.userPhoto;
        const formData = new FormData();
        formData.append('photo', photo)
        return this.http.post<DefaultRes<any>>(url, formData);
    }
}
