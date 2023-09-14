import {inject, Injectable} from '@angular/core';
import {RESOURCE_URLS_TOKEN} from "../../shared/providers/resource-url-provider";
import {WebSocketSubjectConfig} from "rxjs/internal/observable/dom/WebSocketSubject";
import {BehaviorSubject, catchError, Connectable, connectable, delay, Observable, of, retryWhen, take, tap} from "rxjs";
import {webSocket} from "rxjs/webSocket";

@Injectable({
    providedIn: 'root'
})
export class WsService {
    private resourceURLs = inject(RESOURCE_URLS_TOKEN);
    private socket: any;
    public connectionObserver: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {
    }

    public sendMessage(message: {senderId: string, chatRoomId: string, content: string}) {
        if (this.socket) {
            this.socket.socket$.next(message);
        }
    }

    public getMessage() {
        if (this.socket) {
            return this.socket.message$;
        }
    }

    public onConnect(queryParams: { [key: string]: any }) {
        this.onCreateWs(queryParams).subscribe(
            socket => {
                const wsConnect = connectable(socket.pipe(
                    catchError(error => {
                        throw error
                    }),
                    retryWhen(error => {
                        return error.pipe(
                            tap(error => {
                                console.log('try to reconnect', error)
                            }),
                            delay(10000),
                            take(3)
                        )
                    })
                ));
                wsConnect.connect();
                this.socket = {socket$: socket, message$: wsConnect};
            }
        );
    }

    private onCreateWs(queryParams: { [key: string]: any }): Observable<any> {
        const url = this.appendQueryParamsToUrl(this.resourceURLs.wsEndPoint, queryParams);
        const props: WebSocketSubjectConfig<any> = {
            url: url,
            openObserver: {
                next: (e: Event) => {
                    this.connectionObserver.next(true);
                }
            },
            closeObserver: {
                next: (e: Event) => {
                    this.connectionObserver.next(false);
                }
            },
            serializer: msg => JSON.stringify(msg)
        }
        return of(webSocket(props));
    }

    private appendQueryParamsToUrl(url: string, queryParams: { [key: string]: any }): string {
        const queryString = Object.keys(queryParams)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(queryParams[key]))
            .join('&');
        return url + (url.indexOf('?') === -1 ? '?' : '&') + queryString;
    }

}
