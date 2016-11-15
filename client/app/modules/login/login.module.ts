import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {SharedModule} from "../shared/shared.module";
import {NgSemanticModule} from "ng-semantic";
import {LoginComponent} from "./login.component";
import {routing} from "./login.routing";

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        SharedModule.forRoot(),
        NgSemanticModule,
        routing
    ],
    declarations: [LoginComponent]
})
export class LoginModule {
}
