import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {AuthService} from "../../../services/auth.service";
import {CommonService} from "../../../services/common.service";
import {ApiService} from "../../../services/api.service";


@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

    @Output() onAuthenticated = new EventEmitter<boolean>();
    authenticatingBox = false;
    authenticatingTrello = false;
    authenticatingSlack = false;

    constructor(private authService: AuthService,
                private commonService: CommonService,
                private apiService: ApiService) {

    }

    ngOnInit() {
    }

    navigateBoxAuth() {
        this.authenticatingBox = true;
        let authParams = null;
        this.apiService.getAuthParams("box")
            .subscribe(
                res => {
                    authParams = res;
                    if (!authParams) return;

                    let encodedRedirect = encodeURIComponent(authParams.redirectUri);
                    let child = window.open("https://fancypantsgroup.app.box.com/api/oauth2/authorize" +
                        "?response_type=code" +
                        "&client_id=" + authParams.clientId +
                        "&redirect_uri=" + encodedRedirect +
                        "&state=" + this.authService.user.userId, '', 'toolbar=0,status=0,width=626,height=436');
                    if (!child) {
                        this.authenticatingBox = false;
                        return;
                    }
                    // manipulate UI on child window close
                    let timer = setInterval(() => {
                        if (child.closed) {
                            clearInterval(timer);
                            this.authenticatingBox = false;
                            this.onAuthenticated.emit(true);
                            // get user again and check if Box is authenticated
                            this.authService.getMyUser();
                        }
                    }, 500);

                },
                err => console.log(err)
            );
    }

    navigateTrelloAuth() {
        this.authenticatingTrello = true;

        let child = window.open("/auth/trello?userId=" + this.authService.user.userId, '', 'toolbar=0,status=0,width=626,height=436');
        if (!child) {
            this.authenticatingTrello = false;
            return;
        }
        // manipulate UI on child window close
        let timer = setInterval(() => {
            if (child.closed) {
                clearInterval(timer);
                this.authenticatingTrello = false;
                this.onAuthenticated.emit(true);
                // get user again and check if Trello is authenticated
                this.authService.getMyUser();
            }
        }, 500);
    }

    navigateSlackAuth() {
        this.authenticatingSlack = true;
        let authParams = null;
        this.apiService.getAuthParams("slack")
            .subscribe(
                res => {
                    authParams = res;
                    if (!authParams) return;

                    let encodedRedirect = encodeURIComponent(authParams.redirectUri);
                    let child = window.open("https://slack.com/oauth/authorize" +
                        "?client_id=" + authParams.clientId +
                        "&scope=" + "channels:write" +
                        "&redirect_uri=" + encodedRedirect +
                        "&state=" + this.authService.user.userId +
                        "&team=" + authParams.teamId, '', 'toolbar=0,status=0,width=626,height=436');
                    if (!child) {
                        this.authenticatingSlack = false;
                        return;
                    }
                    // manipulate UI on child window close
                    let timer = setInterval(() => {
                        if (child.closed) {
                            clearInterval(timer);
                            this.authenticatingSlack = false;
                            this.onAuthenticated.emit(true);
                            // get user again and check if Slack is authenticated
                            this.authService.getMyUser();
                        }
                    }, 500);
                },
                err => console.log(err))
    }
}
