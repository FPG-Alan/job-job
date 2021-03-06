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


    constructor(private commonService: CommonService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.updateIntegrationStatus()
    }

    onAuthenticated(event: any) {
        this.ngOnInit();
    }
}
