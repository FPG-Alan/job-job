import {Routes, RouterModule} from "@angular/router";
import {ClientsComponent} from "./clients.component";
import {AuthGuard} from "../../services/auth.guard";
import {NewClientComponent} from "./new-client/new-client.component";

export const routes: Routes = [
    {
        path: 'clients',
        children: [
            {path: "", component: ClientsComponent, pathMatch: "full", data: {title: "Clients"}},
            {path: "new", component: NewClientComponent, data: {title: "New Client"}}
        ],
        canActivate: [AuthGuard]
    }
];

export const routing = RouterModule.forChild(routes);