import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {NewClientComponent} from "./new-client.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot()
    ],
    declarations: [NewClientComponent],
    exports: [NewClientComponent]
})
export class NewClientModule {
}
