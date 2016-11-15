import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "./services/auth.guard";

export const routes: Routes = [
    {path: '**', redirectTo: ''}

];

export const appRoutingProviders: any[] = [
    AuthGuard
];

export const routing = RouterModule.forRoot(routes, {useHash: true});