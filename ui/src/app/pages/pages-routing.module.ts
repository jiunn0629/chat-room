import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent} from "./pages.component";

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: 'friends',
                loadChildren: () => import('./friends-page/friends-page.module').then(m => m.FriendsPageModule)
            },
            {
                path: 'chats',
                loadChildren: () => import('./chat-page/chat-page.module').then(m => m.ChatPageModule)
            },
            {
                path: 'settings-page',
                loadChildren: () => import('./settings-page/settings-page.module').then(m => m.SettingsPageModule)
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
