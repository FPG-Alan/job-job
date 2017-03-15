import {Injectable} from "@angular/core";
import {tokenNotExpired} from "angular2-jwt";
import {Router} from "@angular/router";
import {CommonService} from "./common.service";
import {ApiService} from "./api.service";
import {User} from "../classes/user";
import {Observable} from "rxjs";

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
        this.getMyUser();
    }

    private setUpUser() {
        return new Promise<void>(resolve => {
            // set userProfile attribute if already saved profile
            this.profile = JSON.parse(localStorage.getItem('profile'));
            if (this.profile) {
                resolve();
            }

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
                            res => console.log(res),
                            err => {
                                this.commonService.handleError(err);
                                this.logout();
                            },
                            () => resolve()
                        )
                });
                this.router.navigate(["/"]);
            });
        })
    }

    public getMyUser() {
        return new Promise<void>(resolve => {
            this.setUpUser().then(() => {
                this.apiService.getMyUser(this.profile.user_id)
                    .subscribe(
                        res => {
                            this.user = res;
                            console.log("got user");
                            resolve()
                        },
                        err => this.commonService.handleError(err)
                    )
            })
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

    /**
     * Update user to see if authorized/authenticated all required integrations
     * for real time observers
     */
    public updateIntegrationStatus(): Promise<void> {
        // the condition is a Boolean and not primitive boolean
        return new Promise<void>(resolve => {
            this.getMyUser().then(
                resolve => {
                    console.log("user:", this.user)
                    if (this.user.boxAuthenticated &&
                        this.user.trelloAuthenticated &&
                        this.user.slackAuthenticated) {
                        this.allSynced = true;
                    } else {
                        this.allSynced = false;
                    }
                })
        });
    }

    public getIntegrationSyncedStatus(): Promise<boolean> {
        return this.getMyUser().then(
            resolve => {
                if (this.user.boxAuthenticated &&
                    this.user.trelloAuthenticated &&
                    this.user.slackAuthenticated) {
                    return true;
                } else {
                    return false;
                }
            })
    }
}
