import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {routing} from "./jobs.routing";
import {JobsComponent} from "./jobs.component";
import {DetailsComponent} from "./details/details.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot(),
        routing
    ],
    declarations: [JobsComponent, DetailsComponent]
})
export class JobsModule {
}
