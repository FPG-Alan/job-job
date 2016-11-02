import {Routes, RouterModule} from "@angular/router";

import {HomeComponent} from "./home.component";
import {AuthGuard} from "../../services/auth.guard";

export const routes: Routes = [
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard]}
];

export const routing = RouterModule.forChild(routes);