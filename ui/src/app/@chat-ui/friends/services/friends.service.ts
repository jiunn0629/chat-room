import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {RESOURCE_URLS_TOKEN} from "../../../shared/providers/resource-url-provider";
import {ChatRoom, DefaultRes} from "../../../shared/definitions/shared.definitions";
import {AddFriendReq, AddFriendRes} from "../defitiions/friends-defition";

@Injectable({
    providedIn: 'root'
})
export class FriendsService {
    private resourceURLs = inject(RESOURCE_URLS_TOKEN);
    constructor(
        private http: HttpClient,
    ) {
    }

    public addFriend(data: AddFriendReq) {
        const url = this.resourceURLs.addFriend;
        return this.http.post<DefaultRes<AddFriendRes>>(url,data);
    }

    public getFriends(invitationStatus: string) {
        const url = this.resourceURLs.getFriends;
        const options = {
            params: new HttpParams().set('invitationStatus', invitationStatus)
        }
        return this.http.get<DefaultRes<AddFriendRes[]>>(url, options);
    }

    public modifyFriendStatus(friendId: string, invitationStatus: string) {
        const url = this.resourceURLs.modifyFriendStatus.replace('{friendId}',friendId);
        const options = {
            params: new HttpParams().set('invitationStatus', invitationStatus)
        }
        return this.http.put<DefaultRes<null>>(url, {},options);
    }

    public getGroup() {
        const url = this.resourceURLs.getGroup;
        return this.http.get<DefaultRes<ChatRoom[]>>(url);
    }
}
