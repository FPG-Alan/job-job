import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {SettingsComponent} from "./settings.component";
import {routing} from "./settings.routing";
import {AuthenticationModule} from "./authentication/authentication.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot(),
        AuthenticationModule,
        routing
    ],
    declarations: [SettingsComponent]
})
export class SettingsModule {
}
