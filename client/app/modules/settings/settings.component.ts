import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    constructor(private commonService: CommonService,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.updateIntegrationStatus()
    }
}
