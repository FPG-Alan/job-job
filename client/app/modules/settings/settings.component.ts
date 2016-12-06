import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";
import {ApiService} from "../../services/api.service";
import {User} from "../../classes/user";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    localProfile: any;
    user: User = new User("", "", "", false);
    authenticatingBox = false;

    constructor(private authService: AuthService,
                private commonService: CommonService,
                private apiService: ApiService) {

    }

    ngOnInit() {
        this.localProfile = this.authService.getUserProfile();
        this.apiService.getMyUser(this.localProfile.user_id)
            .subscribe(
                res => this.user = res,
                err => this.commonService.handleError(err)
            );
    }

    navigateBoxAuth() {
        this.authenticatingBox = true;
        let authParams = null;
        this.apiService.getBoxAuthParams()
            .subscribe(
                res => {
                    authParams = res;
                    if (!authParams) return;

                    let encodedRedirect = encodeURIComponent(authParams.redirectUri);
                    let child = window.open("https://fancypantsgroup.app.box.com/api/oauth2/authorize" +
                        "?response_type=code" +
                        "&client_id=" + authParams.clientId +
                        "&redirect_uri=" + encodedRedirect +
                        "&state=" + this.user.userId, '', 'toolbar=0,status=0,width=626,height=436');
                    // manipulate UI on child window close
                    let timer = setInterval(() => {
                        if (child.closed) {
                            clearInterval(timer);
                            this.authenticatingBox = false;
                            // get user again and check if Box is authenticated
                            this.apiService.getMyUser(this.localProfile.user_id)
                                .subscribe(
                                    res => this.user = res,
                                    err => this.commonService.handleError(err)
                                )
                        }
                    }, 500);

                },
                err => console.log(err)
            );
    }
}
