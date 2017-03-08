import {Component, OnInit, ViewChild} from "@angular/core";
import {AuthenticationComponent} from "../settings/authentication/authentication.component";
import {CommonService} from "../../services/common.service";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild('authentcation')
    private authenticationComponent: AuthenticationComponent;

    allSynced: boolean;

    constructor(private commonService: CommonService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.isAllAuthenticated()
            .subscribe(
                res => {
                    if (res == true) this.allSynced = true;
                    else this.allSynced = false;
                },
                err => {
                    this.allSynced = false;
                    this.commonService.handleError(err);
                }
            )
    }

    onAuthenticated(event: any) {
        this.ngOnInit()
    }
}
