import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home.component";
import {AuthGuard} from "../../services/auth.guard";

export const routes: Routes = [
    {path: '', component: HomeComponent, canActivate: [AuthGuard], data: {title: "Home"}}
];

export const routing = RouterModule.forChild(routes);