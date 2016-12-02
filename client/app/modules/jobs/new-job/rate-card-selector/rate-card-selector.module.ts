import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import {RateCardSelectorComponent} from "./rate-card-selector.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot()
    ],
    declarations: [RateCardSelectorComponent],
    exports: [RateCardSelectorComponent]
})
export class RateCardSelectorModule {
}
