import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {HomeComponent} from "./home.component";
import {routing} from "./home.routing";
import {JobsModule} from "../jobs/jobs.module";
import {ClientsModule} from "../clients/clients.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule.forRoot(),
        JobsModule,
        ClientsModule,
        routing
    ],
    declarations: [
        HomeComponent
    ]
})
export class HomeModule {
}
