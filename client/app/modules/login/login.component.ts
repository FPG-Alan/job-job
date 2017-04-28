import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../classes/user";
import {ApiService} from "../../services/api.service";
import {CommonService} from "../../services/common.service";

// avoid name not found warnings
declare var Auth0Lock: any;

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

    // configure Auth0
    options = {
        auth: {
            redirect: false,
            params: {
                scope: "openid email user_metadata app_metadata"
            }
        },
        autoclose: true
    };
    lock = new Auth0Lock('BmfEv2P1nNMOxyUDANG5o5Akf_4QOuvY', 'fpg.auth0.com', this.options);

    constructor(private router: Router,
                private commonService: CommonService,
                private apiService: ApiService,
                private authService: AuthService) {
        // add callback for lock "authenticated" event
        this.lock.on("authenticated", (authResult) => {
            localStorage.setItem("id_token", authResult.idToken);
            this.lock.getProfile(authResult.idToken, (err, profile) => {
                if (err) {
                    alert(err);
                    return;
                }
                localStorage.setItem("profile", JSON.stringify(profile));
                this.authService.profile = profile;
                // store User in database
                let u = new User("", "", "", false, false, false);
                u.userId = this.authService.profile.user_id;
                u.name = this.authService.profile.name;
                u.email = this.authService.profile.email;
                this.apiService.getOrCreateMyUser(u)
                    .subscribe(
                        res => {
                            // need to set authService.profile before Home route canActivate
                            console.log(res);
                            this.router.navigate(["/"]);
                        },
                        err => this.commonService.handleError(err)
                    )
            });
        });
    }

    ngOnInit() {
        if (this.authService.authenticated()) {
            this.router.navigate(["/"]);
        }
    }

    public login() {
        // call the show method to display the widget.
        this.lock.show();
    };
}
