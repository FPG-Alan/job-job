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
    profile: any;
    allSynced: boolean;

    constructor(private router: Router,
                private commonService: CommonService,
                private apiService: ApiService) {
        // if getting profile fails, AuthGuard will prevent users from activating guarded components
        this.getAuthProfile();
    }

    public getAuthProfile() {
        this.profile = JSON.parse(localStorage.getItem('profile'));
    }

    public getMyUser(updateAuthStatus: boolean) {
        return new Promise<void>(
            resolve => {
                if (!this.profile) {
                    return;
                }
                this.apiService.getMyUser(this.profile.user_id)
                    .subscribe(
                        res => {
                            this.user = res;
                            if (updateAuthStatus) {
                                this.apiService.updateAuthStatus(this.user.userId)
                                    .subscribe(
                                        res => this.user = res,
                                        err => this.commonService.handleError(err)
                                    );
                            }
                        },
                        err => {
                            this.commonService.handleError(err);
                            this.logout();
                        }
                    )
            }
        )
    }

    public login() {
        // add callback for lock "authenticated" event
        this.lock.on("authenticated", (authResult) => {
            localStorage.setItem("id_token", authResult.idToken);
            this.lock.getProfile(authResult.idToken, (err, profile) => {
                if (err) {
                    alert(err);
                    return;
                }
                localStorage.setItem("profile", JSON.stringify(profile));
                this.profile = profile;
                // store User in database
                let u = new User("", "", "", false, false, false);
                u.userId = this.profile.user_id;
                u.name = this.profile.name;
                u.email = this.profile.email;
                this.apiService.getOrCreateMyUser(u)
                    .subscribe(
                        res => {
                            console.log(res);
                            this.router.navigate(["/"]);
                        },
                        err => this.commonService.handleError(err)
                    )
            });
        });
        // call the show method to display the widget.
        this.lock.show();
    };

    public authenticated() {
        // check if there's an unexpired JWT
        // this searches for an item in localStorage with key == 'id_token'
        return tokenNotExpired() && this.profile;
    };

    public logout() {
        // remove token from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        this.router.navigate(["/login"]);
    };

    /**
     * Update user status to see if authorized/authenticated all required integrations
     * for template rendering
     */
    public updateIntegrationStatus() {
        // the IF condition below would return a Boolean and not primitive boolean,
        // hence we don't assign it directly to allSynced
        this.getMyUser(true).then(
            resolve => {
                if (this.user &&
                    this.user.boxAuthenticated &&
                    this.user.trelloAuthenticated &&
                    this.user.slackAuthenticated) {
                    this.allSynced = true;
                } else {
                    this.allSynced = false;
                }
            })
    }

    /**
     * Returns whether user has authorized/authenticated all required integrations
     * for guards (pre-rendering)
     */
    public getIntegrationSyncedStatus(): Promise<boolean> {
        // the IF condition below would return a Boolean and not primitive boolean,
        // hence we don't return the condition directly
        return this.getMyUser(true).then(
            resolve => {
                if (this.user &&
                    this.user.boxAuthenticated &&
                    this.user.trelloAuthenticated &&
                    this.user.slackAuthenticated) {
                    return true;
                } else {
                    return false;
                }
            })
    }
}
