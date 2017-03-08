import {Component, OnInit, ViewChild} from "@angular/core";
import {AuthenticationComponent} from "../settings/authentication/authentication.component";
import {AuthService} from "../../services/auth.service";
import {User} from "../../classes/user";
import {ApiService} from "../../services/api.service";
import {CommonService} from "../../services/common.service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild('authentcation')
    private authenticationComponent: AuthenticationComponent;

    allSynced: boolean;
    localProfile: any;
    user: User = new User("", "", "", false, false, false);

    constructor(private authService: AuthService,
                private apiService: ApiService,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.localProfile = this.authService.getUserProfile();
        this.apiService.getMyUser(this.localProfile.user_id)
            .subscribe(
                res => {
                    this.user = res;
                    this.allSynced = this.user.boxAuthenticated &&
                    this.user.trelloAuthenticated &&
                    this.user.slackAuthenticated
                        ? true
                        : false;
                },
                err => this.commonService.handleError(err)
            );
    }
}
