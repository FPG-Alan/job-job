import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "./services/auth.guard";
import {IntegrationsGuard} from "./services/integrations.guard";
import {CanDeactivateGuard} from "./services/can-deactivate.guard";

export const routes: Routes = [
    {path: '**', redirectTo: ''}

];

export const appRoutingProviders: any[] = [
    AuthGuard,
    IntegrationsGuard,
    CanDeactivateGuard
];

export const routing = RouterModule.forRoot(routes, {useHash: true});