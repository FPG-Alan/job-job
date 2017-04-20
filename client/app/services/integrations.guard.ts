import {Injectable} from "@angular/core";
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
export class IntegrationsGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return new Promise<boolean>(resolve => {
            this.authService.getIntegrationSyncedStatus()
                .then(res => {
                    resolve(res);
                });
        });
    }
}