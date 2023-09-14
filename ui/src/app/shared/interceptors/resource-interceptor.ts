import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ResourceInterceptor implements HttpInterceptor{

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');
        const request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        return next.handle(request);
    }
}