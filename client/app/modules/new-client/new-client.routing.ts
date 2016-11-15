import {Routes, RouterModule} from "@angular/router";

import {NewClientComponent} from "./new-client.component";
import {AuthGuard} from "../../services/auth.guard";

export const routes: Routes = [
    {path: 'new-client', component: NewClientComponent, canActivate: [AuthGuard]}
];

export const routing = RouterModule.forChild(routes);