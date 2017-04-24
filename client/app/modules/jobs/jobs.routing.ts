import {Routes, RouterModule} from "@angular/router";
import {JobsComponent} from "./jobs.component";
import {AuthGuard} from "../../services/auth.guard";
import {DetailsComponent} from "./details/details.component";
import {NewJobComponent} from "./new-job/new-job.component";
import {IntegrationsGuard} from "../../services/integrations.guard";
import {CanDeactivateGuard} from "../../services/can-deactivate.guard";

export const routes: Routes = [
    {
        // tricky; having a componentless parent route will hide parent content
        // if children's contents are activated
        path: "jobs",
        data: {title: "Jobs"},
        children: [{
            path: "",
            component: JobsComponent,
            pathMatch: "full"
        }, {
            path: "details/:id",
            component: DetailsComponent,
            data: {title: "Job Details"}
        }, {
            path: "new",
            component: NewJobComponent,
            canActivate: [IntegrationsGuard],
            canDeactivate: [CanDeactivateGuard],
            data: {title: "New Job"}
        }],
        canActivate: [AuthGuard]
    }
];

export const routing = RouterModule.forChild(routes);