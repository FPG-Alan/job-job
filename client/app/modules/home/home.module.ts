import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {SharedModule} from "../shared/shared.module";
import {NgSemanticModule} from "ng-semantic";

import {HomeComponent} from "./home.component";
import {routing} from "./home.routing";

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        SharedModule.forRoot(),
        NgSemanticModule,
        routing
    ],
    declarations: [HomeComponent]
})
export class HomeModule {
}
