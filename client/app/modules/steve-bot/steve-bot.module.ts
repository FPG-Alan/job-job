import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {SteveBotComponent} from "./steve-bot.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule.forRoot()
    ],
    declarations: [SteveBotComponent],
    exports: [SteveBotComponent]
})
export class SteveBotModule {
}
