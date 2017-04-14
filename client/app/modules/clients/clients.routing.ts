import {Routes, RouterModule} from "@angular/router";
import {ClientsComponent} from "./clients.component";
import {AuthGuard} from "../../services/auth.guard";

export const routes: Routes = [
    {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [AuthGuard],
        data: {title: "Clients"}
    }
];

export const routing = RouterModule.forChild(routes);