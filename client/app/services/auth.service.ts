import {Injectable} from "@angular/core";
import {tokenNotExpired} from "angular2-jwt";
import {Router} from "@angular/router";
import {CommonService} from "./common.service";
import {ApiService} from "./api.service";
import {User} from "../classes/user";


@Injectable()
export class AuthService {

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

    public getMyUser(updateAuthStatus: boolean): Promise<void> {
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
                                        res => {
                                            this.user = res;
                                            resolve()
                                        },
                                        err => this.commonService.handleError(err)
                                    );
                            } else resolve();
                        },
                        err => {
                            this.commonService.handleError(err);
                            this.logout();
                            resolve();
                        }
                    )
            }
        )
    }

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
        this.getMyUser(true)
            .then(() => {
                if (this.user &&
                    this.user.boxAuthenticated &&
                    this.user.trelloAuthenticated &&
                    this.user.slackAuthenticated) {
                    this.allSynced = true;
                } else {
                    this.allSynced = false;
                }
            });
    }

    /**
     * Returns whether user has authorized/authenticated all required integrations
     * for guards (pre-rendering)
     */
    public getIntegrationSyncedStatus(): Promise<boolean> {
        // the IF condition below would return a Boolean and not primitive boolean,
        // hence we don't return the condition directly
        return new Promise<boolean>(resolve => {
            this.getMyUser(true).then(() => {
                if (this.user &&
                    this.user.boxAuthenticated &&
                    this.user.trelloAuthenticated &&
                    this.user.slackAuthenticated) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }
}
