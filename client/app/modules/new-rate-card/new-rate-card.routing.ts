import {Routes, RouterModule} from "@angular/router";
import {NewRateCardComponent} from "./new-rate-card.component";
import {AuthGuard} from "../../services/auth.guard";

export const routes: Routes = [
    {path: 'new-rate-card', component: NewRateCardComponent, canActivate: [AuthGuard]}
];

export const routing = RouterModule.forChild(routes);