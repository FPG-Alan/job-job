import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {routing} from "./jobs.routing";
import {RateCardSelectorModule} from "./rate-card-selector/rate-card-selector.module";
import {JobsComponent} from "./jobs.component";
import {DetailsComponent} from "./details/details.component";
import {NewJobComponent} from "./new-job/new-job.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot(),
        RateCardSelectorModule,
        routing
    ],
    declarations: [JobsComponent, DetailsComponent, NewJobComponent]
})
export class JobsModule {
}
