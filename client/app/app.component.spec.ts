/* tslint:disable:no-unused-variable */

import {TestBed, async} from "@angular/core/testing";
import {AppComponent} from "./app.component";
import {RouterTestingModule} from "@angular/router/testing";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NgSemanticModule} from "ng-semantic";
import {LoginModule} from "./modules/login/login.module";
import {HomeModule} from "./modules/home/home.module";
import {NewJobModule} from "./modules/new-job/new-job.module";
import {routing, appRoutingProviders} from "./app.routing";
import {AUTH_PROVIDERS} from "angular2-jwt";

describe('App: JobJob', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
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
                NewJobModule,
                routing,
                RouterTestingModule
            ],
            providers: [
                appRoutingProviders,
                AUTH_PROVIDERS
            ],
        });
    });

    it('should create the app', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'app works!'`, async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('app works!');
    }));

    it('should render title in a h1 tag', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('app works!');
    }));
});
