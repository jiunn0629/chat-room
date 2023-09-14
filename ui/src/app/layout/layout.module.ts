import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout.component';
import {MenuComponent} from './menu/menu.component';
import {LayoutService} from "./services/layout.service";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {SharedModule} from "../shared/shared.module";


@NgModule({
    declarations: [
        LayoutComponent,
        MenuComponent,
    ],
    imports: [
        CommonModule,
        RouterLinkActive,
        RouterLink,
        RouterOutlet,
        SharedModule
    ],
    exports: [
        LayoutComponent,
        MenuComponent,
    ],
    providers: [
        LayoutService
    ]
})
export class LayoutModule {
}
