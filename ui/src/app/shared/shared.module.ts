import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularMaterialModule} from "./angular-material/angular-material.module";
import {ToastService} from "./services/toast.service";
import {UserService} from "./services/user.service";
import {ChatRoomService} from "./services/chat-room.service";
import {HttpClientModule} from "@angular/common/http";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {OrderByPipe} from './pipes/order-by.pipe';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        OrderByPipe
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        HttpClientModule,
        NgxSkeletonLoaderModule,
        TranslateModule.forChild()
    ],
    exports: [
        AngularMaterialModule,
        OrderByPipe,
    ],

})
export class SharedModule {
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: SharedModule,
            providers: [
                ToastService,
                UserService,
                ChatRoomService
            ]
        }
    }
}