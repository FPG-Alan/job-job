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
        $('.ui.dropdown').dropdown();

        $('#notif-message .close')
            .on('click', function () {
                $(this).closest('.message').transition('fade');
            });
    }

    toggleSidebar() {
        $(".ui.sidebar")
            .sidebar('setting', 'transition', 'overlay')
            .sidebar("toggle");
    }
}
