import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {SharedModule} from "../shared/shared.module";
import {NgSemanticModule} from "ng-semantic";
import {HomeComponent} from "./home.component";
import {routing} from "./home.routing";
import {NewJobModule} from "../new-job/new-job.module";
import {DisplayUsersComponent} from "../../components/display-users/display-users.component";
import {DisplayJobsComponent} from "../../components/display-jobs/display-jobs.component";
import {DisplayClientsComponent} from "../../components/display-clients/display-clients.component";

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        SharedModule.forRoot(),
        NgSemanticModule,
        NewJobModule,
        routing
    ],
    declarations: [
        HomeComponent,
        DisplayUsersComponent,
        DisplayJobsComponent,
        DisplayClientsComponent
    ]
})
export class HomeModule {
}
