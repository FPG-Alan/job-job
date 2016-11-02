import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import { NgSemanticModule } from "ng-semantic";
import {AppComponent} from "./app.component";
import {LoginModule} from "./modules/login/login.module";
import {HomeModule} from "./modules/home/home.module";
import {routing} from "./app.routing";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgSemanticModule,
        LoginModule,
        HomeModule,
        routing
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
