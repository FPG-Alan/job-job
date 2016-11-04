import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {ApiService} from "../../services/api.service";
import {TenKFtService} from "../../services/ten-k-ft.service";

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
                AuthService,
                ApiService,
                TenKFtService
            ]
        };
    }
}
