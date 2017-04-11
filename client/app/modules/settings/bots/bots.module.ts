import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import {BotsComponent} from "./bots.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule.forRoot()
    ],
    declarations: [BotsComponent],
    exports: [BotsComponent]
})
export class BotsModule {
}
