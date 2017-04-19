import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {routing} from "./jobs.routing";
import {RateCardSelectorModule} from "./rate-card-selector/rate-card-selector.module";
import {JobsComponent} from "./jobs.component";
import {DetailsComponent} from "./details/details.component";
import {NewJobComponent} from "./new-job/new-job.component";
import {ConfirmComponent} from "./confirm/confirm.component";
import {NewClientModule} from "../clients/new-client/new-client.module";
import {SteveBotModule} from "../steve-bot/steve-bot.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot(),
        RateCardSelectorModule,
        NewClientModule,
        SteveBotModule,
        routing
    ],
    declarations: [JobsComponent, DetailsComponent, NewJobComponent, ConfirmComponent]
})
export class JobsModule {
}
