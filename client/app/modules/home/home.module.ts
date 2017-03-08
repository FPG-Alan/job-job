import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {HomeComponent} from "./home.component";
import {routing} from "./home.routing";
import {JobsModule} from "../jobs/jobs.module";
import {ClientsModule} from "../clients/clients.module";
import {AuthenticationModule} from "../settings/authentication/authentication.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule.forRoot(),
        JobsModule,
        ClientsModule,
        AuthenticationModule,
        routing
    ],
    declarations: [
        HomeComponent
    ]
})
export class HomeModule {
}
