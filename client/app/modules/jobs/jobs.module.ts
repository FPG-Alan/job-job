import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {JobsComponent} from "./jobs.component";
import {routing} from "./jobs.routing";
import {SharedModule} from "../shared/shared.module";
import { DetailsComponent } from './details/details.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule.forRoot(),
        routing
    ],
    declarations: [JobsComponent, DetailsComponent]
})
export class JobsModule {
}
