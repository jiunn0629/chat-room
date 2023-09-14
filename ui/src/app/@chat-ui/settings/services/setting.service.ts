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
  ) { }

  public getUserPhoto(userId: string) {
    const url = this.resourceURLs.userPhoto.replace('{userId}', userId);
    return this.http.get<Blob>(url,{responseType: 'blob' as 'json'});
  }

  public uploadUserPhoto(userId: string, photo: File) {
    const url = this.resourceURLs.userPhoto.replace('{userId}', userId);
    const formData = new FormData();
    formData.append('photo', photo)
    return this.http.post<DefaultRes<any>>(url, formData);
  }
}
