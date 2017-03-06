import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {CommonService} from "../../services/common.service";
import {AuthService} from "../../services/auth.service";
import {ApiService} from "../../services/api.service";
import {IntegrationsService} from "../../services/integrations.service";
import {CharacterLimitPipe} from "../../pipes/character-limit.pipe";
import {SearchPipe} from "../../pipes/filter.pipe";

@NgModule({
    imports: [CommonModule],
    declarations: [CharacterLimitPipe, SearchPipe],
    exports: [CharacterLimitPipe, SearchPipe]
})
export class SharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                CommonService,
                AuthService,
                ApiService,
                IntegrationsService
            ]
        };
    }
}
