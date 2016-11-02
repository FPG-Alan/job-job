import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "./services/auth.guard";

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'home'}

];

export const appRoutingProviders: any[] = [
    AuthGuard
];

export const routing = RouterModule.forRoot(routes, {useHash: true});