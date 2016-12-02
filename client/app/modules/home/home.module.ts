import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {HomeComponent} from "./home.component";
import {routing} from "./home.routing";
import {NewClientModule} from "../new-client/new-client.module";
import {JobsModule} from "../jobs/jobs.module";
import {DisplayUsersComponent} from "../../components/display-users/display-users.component";
import {DisplayClientsComponent} from "../../components/display-clients/display-clients.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule.forRoot(),
        NewClientModule,
        JobsModule,
        routing
    ],
    declarations: [
        HomeComponent,
        DisplayUsersComponent,
        DisplayClientsComponent
    ]
})
export class HomeModule {
}
