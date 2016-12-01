import {Routes, RouterModule} from "@angular/router";
import {JobsComponent} from "./jobs.component";
import {AuthGuard} from "../../services/auth.guard";
import {DetailsComponent} from "./details/details.component";
import {NewJobComponent} from "../new-job/new-job.component";

export const routes: Routes = [
    {
        path: "jobs",
        children: [
            {path: "", component: JobsComponent, pathMatch: "full"},
            {path: "details/:id", component: DetailsComponent},
            {path: "new", component: NewJobComponent}
        ],
        canActivate: [AuthGuard]
    }
];

export const routing = RouterModule.forChild(routes);