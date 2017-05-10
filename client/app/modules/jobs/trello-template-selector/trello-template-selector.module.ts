import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {TrelloTemplateSelectorComponent} from "./trello-template-selector.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot()
    ],
    declarations: [TrelloTemplateSelectorComponent],
    exports: [TrelloTemplateSelectorComponent]
})
export class TrelloTemplateSelectorModule {
}
