import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesModule} from "./pages/pages.module";
import {AuthModule} from "./auth/auth.module";
import {authGuard} from "./shared/guard/auth.guard";

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => {
            return AuthModule
        },
    },
    {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
        canActivate: [authGuard]
    },
    {
        path: '', redirectTo: 'auth/login', pathMatch: 'full'
    },
    {
        path: '**', redirectTo: 'auth/login'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
