import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {NewJobComponent} from "./new-job.component";
import {routing} from "./new-job.routing";
import { RateCardSelectorComponent } from './rate-card-selector/rate-card-selector.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot(),
        routing
    ],
    declarations: [NewJobComponent, RateCardSelectorComponent]
})
export class NewJobModule {
}
