import {Injectable} from "@angular/core";
import {tokenNotExpired} from "angular2-jwt";
import {Router} from "@angular/router";

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
    // Configure Auth0
    options = {
        auth: {redirect: false},
        autoclose: true
    };
    lock = new Auth0Lock('1CD38zBzoOUTvLzrWlredXlx0Q1IRJNJ', 'davefpg.auth0.com', this.options);

    constructor(private router: Router) {
        // Add callback for lock `authenticated` event
        this.lock.on("authenticated", (authResult) => {
            localStorage.setItem('id_token', authResult.idToken);

            this.router.navigate(["/home"]);
        });
    }

    public login() {
        // Call the show method to display the widget.
        this.lock.show();
    };

    public authenticated() {
        // Check if there's an unexpired JWT
        // This searches for an item in localStorage with key == 'id_token'
        return tokenNotExpired();
    };

    public logout() {
        // Remove token from localStorage
        localStorage.removeItem('id_token');
        this.router.navigate(["/login"])
    };
}