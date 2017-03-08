import {Injectable} from "@angular/core";
import {tokenNotExpired} from "angular2-jwt";
import {Router} from "@angular/router";
import {CommonService} from "./common.service";
import {ApiService} from "./api.service";
import {User} from "../classes/user";

// avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
    // configure Auth0
    options = {
        auth: {redirect: false},
        autoclose: true
    };
    lock = new Auth0Lock('1CD38zBzoOUTvLzrWlredXlx0Q1IRJNJ', 'davefpg.auth0.com', this.options);

    user: User = new User("", "", "", false, false, false);

    constructor(private router: Router,
                private commonService: CommonService,
                private apiService: ApiService) {
        // add callback for lock "authenticated" event
        this.lock.on("authenticated", (authResult) => {
            localStorage.setItem("id_token", authResult.idToken);
            this.lock.getProfile(authResult.idToken, (err, profile) => {
                if (err) {
                    alert(err);
                    return;
                }
                localStorage.setItem("profile", JSON.stringify(profile));
                // store user info in database
                if (profile) {
                    this.user.userId = profile.user_id;
                    this.user.name = profile.name;
                    this.user.email = profile.email;
                    this.apiService.getOrCreateMyUser(this.user)
                        .subscribe(
                            res => this.user = res,
                            err => this.commonService.handleError(err)
                        )
                }
                console.log(profile);
            });
            this.router.navigate(["/"]);
        });
    }

    public login() {
        // call the show method to display the widget.
        this.lock.show();
    };

    public authenticated() {
        // check if there's an unexpired JWT
        // this searches for an item in localStorage with key == 'id_token'
        return tokenNotExpired();
    };

    public logout() {
        // remove token from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        this.router.navigate(["/login"]);
    };

    public getUserProfile() {
        return JSON.parse(localStorage.getItem("profile"));
    }

    public isAllAuthenticated() {
        let localProfile = this.getUserProfile();
        return this.apiService.getMyUser(localProfile.user_id)
            .map(res => res.boxAuthenticated &&
                res.trelloAuthenticated &&
                res.slackAuthenticated
            );
    }
}
