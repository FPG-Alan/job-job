import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {NewRateCardComponent} from "./new-rate-card.component";
import {routing} from "./new-rate-card.routing";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot(),
        routing
    ],
    declarations: [NewRateCardComponent]
})
export class NewRateCardModule {
}
