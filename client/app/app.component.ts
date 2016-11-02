import {Component} from "@angular/core";
import {AuthService} from "./services/auth.service";

declare var $;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    title = 'app works!';

    constructor(private authService: AuthService) {
    }

    toggleSidebar() {
        $(".ui.sidebar").sidebar("toggle");
    }
}
