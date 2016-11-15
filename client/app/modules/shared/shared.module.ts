import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CommonService} from "../../services/common.service";
import {AuthService} from "../../services/auth.service";
import {ApiService} from "../../services/api.service";
import {TenKFtService} from "../../services/ten-k-ft.service";
import {BoxService} from "../../services/box.service";

@NgModule({
    imports: [CommonModule],
    declarations: [/* Declare components and pipes */],
    exports: [/* Export them */]
})
export class SharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                CommonService,
                AuthService,
                ApiService,
                TenKFtService,
                BoxService
            ]
        };
    }
}
