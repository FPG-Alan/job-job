import {Injectable} from "@angular/core";
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
export class IntegrationsGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isAllAuthenticated()) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}