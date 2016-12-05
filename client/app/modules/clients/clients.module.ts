import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {ClientsComponent} from "./clients.component";
import {routing} from "./clients.routing";
import {NewClientComponent} from "./new-client/new-client.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule.forRoot(),
        routing
    ],
    declarations: [ClientsComponent, NewClientComponent]
})
export class ClientsModule {
}
