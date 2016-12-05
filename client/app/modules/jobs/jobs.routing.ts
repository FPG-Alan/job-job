import {Routes, RouterModule} from "@angular/router";
import {JobsComponent} from "./jobs.component";
import {AuthGuard} from "../../services/auth.guard";
import {DetailsComponent} from "./details/details.component";
import {NewJobComponent} from "./new-job/new-job.component";

export const routes: Routes = [
    {
        path: "jobs",
        children: [
            {path: "", component: JobsComponent, pathMatch: "full", data: {title: "Jobs"}},
            {path: "details/:id", component: DetailsComponent, data: {title: "Job Details"}},
            {path: "new", component: NewJobComponent, data: {title: "New Job"}}
        ],
        canActivate: [AuthGuard]
    }
];

export const routing = RouterModule.forChild(routes);