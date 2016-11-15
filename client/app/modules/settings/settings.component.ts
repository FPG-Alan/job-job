import {Component, OnInit} from "@angular/core";
import {BoxService} from "../../services/box.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    constructor(private boxService: BoxService) {
    }

    ngOnInit() {
    }

    authBox() {
        this.boxService.authTest()
            .subscribe(res => console.log(res))
    }
}
