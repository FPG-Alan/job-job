import {Routes, RouterModule} from "@angular/router";
import {SettingsComponent} from "./settings.component";
import {AuthGuard} from "../../services/auth.guard";

export const routes: Routes = [
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
        data: { title: "Settings" }
    }
];

export const routing = RouterModule.forChild(routes);