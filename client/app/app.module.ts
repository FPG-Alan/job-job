import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NgSemanticModule} from "ng-semantic";
import {AUTH_PROVIDERS} from "angular2-jwt";
import {AppComponent} from "./app.component";
import {routing, appRoutingProviders} from "./app.routing";
import {LoginModule} from "./modules/login/login.module";
import {HomeModule} from "./modules/home/home.module";

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
    providers: [
        appRoutingProviders,
        AUTH_PROVIDERS
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
