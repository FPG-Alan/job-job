import {Injectable} from "@angular/core";
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
export class IntegrationsGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.isAllAuthenticated().map(allAuthed => {
            if (allAuthed) {
                console.log("all authed")
                return true
            } else {
                this.router.navigate(['/']);
                return false;
            }
        })
    }
}