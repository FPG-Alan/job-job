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

    user: User = new User("", "", false);
    authenticatingBox = false;

    constructor(private authService: AuthService,
                private commonService: CommonService,
                private apiService: ApiService) {
    }

    ngOnInit() {
        let localProfile = this.authService.getUserProfile();
        if (localProfile) {
            this.user.name = localProfile.name;
            this.user.email = localProfile.email;
            if (!this.commonService.isEmptyString(this.user.email)) {
                this.apiService.findOrCreateMyUser(this.user)
                    .subscribe(
                        res => this.user = res,
                        err => this.commonService.handleError(err)
                    )
            }
        }
    }

    navigateBoxAuth() {
        this.authenticatingBox = true;

        let encodedRedirect = encodeURIComponent("http://localhost:3000/auth/box");
        let child = window.open("https://fancypantsgroup.app.box.com/api/oauth2/authorize" +
            "?response_type=code" +
            "&client_id=lz5d03ybnt9kc77bhwib4b4kc2i3e6kf" +
            "&redirect_uri=" + encodedRedirect, '', 'toolbar=0,status=0,width=626,height=436');
        // manipulate UI on child window close
        let timer = setInterval(() => {
            if (child.closed) {
                clearInterval(timer);
                this.authenticatingBox = false;
                console.log(this);
            }
        }, 500);

    }
}
