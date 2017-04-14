import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Http, HttpModule, RequestOptions} from "@angular/http";
import {AuthHttp, AuthConfig} from "angular2-jwt";
import {AppComponent} from "./app.component";
import {BreadcrumbComponent} from "./components/breadcrumb/breadcrumb.component";
import {routing, appRoutingProviders} from "./app.routing";
import {LoginModule} from "./modules/login/login.module";
import {HomeModule} from "./modules/home/home.module";
import {SettingsModule} from "./modules/settings/settings.module";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({}), http, options);
}

@NgModule({
    declarations: [
        AppComponent,
        BreadcrumbComponent
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
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
