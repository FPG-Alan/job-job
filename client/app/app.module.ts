import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AUTH_PROVIDERS} from "angular2-jwt";
import {AppComponent} from "./app.component";
import {routing, appRoutingProviders} from "./app.routing";
import {LoginModule} from "./modules/login/login.module";
import {HomeModule} from "./modules/home/home.module";
import {SettingsModule} from "./modules/settings/settings.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        LoginModule,
        HomeModule,
        SettingsModule,
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
