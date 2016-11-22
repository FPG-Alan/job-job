import {Routes, RouterModule} from "@angular/router";
import {NewJobComponent} from "./new-job.component";
import {AuthGuard} from "../../services/auth.guard";

export const routes: Routes = [
    {path: 'new-job', component: NewJobComponent, canActivate: [AuthGuard]}
];

export const routing = RouterModule.forChild(routes);