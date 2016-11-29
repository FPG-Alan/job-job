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
            )
    }

    navigateBoxAuth() {
        this.authenticatingBox = true;

        let encodedRedirect = encodeURIComponent("http://localhost:3000/auth/box");
        let child = window.open("https://fancypantsgroup.app.box.com/api/oauth2/authorize" +
            "?response_type=code" +
            "&client_id=lz5d03ybnt9kc77bhwib4b4kc2i3e6kf" +
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

    }
}
