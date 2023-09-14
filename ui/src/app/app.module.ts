import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ResourceInterceptor} from "./shared/interceptors/resource-interceptor";
import {RESOURCE_URLS_TOKEN, ResourceURLS} from "./shared/providers/resource-url-provider";
import {SharedModule} from "./shared/shared.module";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NgbModule,
        SharedModule.forRoot()
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResourceInterceptor,
            multi: true
        },
        {provide: RESOURCE_URLS_TOKEN, useValue: ResourceURLS},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}