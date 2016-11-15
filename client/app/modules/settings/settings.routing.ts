import {Routes, RouterModule} from "@angular/router";
import {SettingsComponent} from "./settings.component";
import {AuthGuard} from "../../services/auth.guard";

export const routes: Routes = [
    {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]}
];

export const routing = RouterModule.forChild(routes);