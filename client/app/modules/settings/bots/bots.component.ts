import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'app-bots',
    templateUrl: './bots.component.html',
    styleUrls: ['./bots.component.scss']
})
export class BotsComponent implements OnInit {

    // default settings
    botSettings = {
        "steve": true
    };

    constructor() {
    }

    ngOnInit() {
        if (this.getLocalSettings()) {
            this.botSettings = this.getLocalSettings();
        }
        localStorage.setItem("settings", JSON.stringify(this.botSettings));
    }

    getLocalSettings() {
        return JSON.parse(localStorage.getItem("settings"));
    }

    toggleLocalSettings(option: string) {
        if (this.botSettings) {
            this.botSettings[option] = !this.botSettings[option];
            localStorage.setItem("settings", JSON.stringify(this.botSettings));
        }
    }
}
