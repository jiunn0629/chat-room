import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RESOURCE_URLS_TOKEN} from "../../shared/providers/resource-url-provider";
import {LoginReq, LoginRes, RegisterReq, RegisterRes} from "../definitions/auth-definition";
import {DefaultRes} from "../../shared/definitions/shared.definitions";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private resourceURLs = inject(RESOURCE_URLS_TOKEN);
    constructor(
        private http: HttpClient,
    ) {
    }

    public register(data: RegisterReq) {
        const url: string = this.resourceURLs.register;
        return this.http.post<DefaultRes<RegisterRes>>(url,data);
    }

    public login(data: LoginReq) {
        const url: string = this.resourceURLs.login;
        return this.http.post<DefaultRes<LoginRes>>(url, data);
    }


}
