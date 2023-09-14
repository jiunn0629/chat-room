import {inject, Inject, Injectable} from '@angular/core';
import {DefaultRes, User} from "../definitions/shared.definitions";
import {HttpClient} from "@angular/common/http";
import {RESOURCE_URLS_TOKEN, ResourceUrls} from "../providers/resource-url-provider";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private resourceURLs: ResourceUrls = inject(RESOURCE_URLS_TOKEN);
  constructor(
      private http: HttpClient,
  ) { }

  public getUser(userId: string) {
    const url = this.resourceURLs.getUser.replace('{userId}',userId);
    return this.http.get<DefaultRes<User>>(url);
  }
}
