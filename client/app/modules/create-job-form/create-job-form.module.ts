import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CreateJobFormComponent} from "./create-job-form.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [CreateJobFormComponent],
    exports: [CreateJobFormComponent]
})
export class CreateJobFormModule {
}
