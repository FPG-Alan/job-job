import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {SharedModule} from "../shared/shared.module";
import {NgSemanticModule} from "ng-semantic";
import {HomeComponent} from "./home.component";
import {routing} from "./home.routing";
import {NewJobModule} from "../new-job/new-job.module";
import {NewClientModule} from "../new-client/new-client.module";
import {NewRateCardModule} from "../new-rate-card/new-rate-card.module";
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
        NewClientModule,
        NewRateCardModule,
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
