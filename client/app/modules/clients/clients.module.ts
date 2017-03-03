import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {NewClientModule} from "./new-client/new-client.module";
import {ClientsComponent} from "./clients.component";
import {routing} from "./clients.routing";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot(),
        NewClientModule,
        routing
    ],
    declarations: [ClientsComponent]
})
export class ClientsModule {
}
