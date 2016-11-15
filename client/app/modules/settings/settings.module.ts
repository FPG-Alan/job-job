import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {SettingsComponent} from "./settings.component";
import {routing} from "./settings.routing";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot(),
        routing
    ],
    declarations: [SettingsComponent]
})
export class SettingsModule {
}
