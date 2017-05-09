import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {BoxTemplateSelectorComponent} from "./box-template-selector.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot()
    ],
    declarations: [BoxTemplateSelectorComponent],
    exports: [BoxTemplateSelectorComponent]
})
export class BoxTemplateSelectorModule {
}
