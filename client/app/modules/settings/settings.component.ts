import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    navigateBoxAuth() {
        let encodedRedirect = encodeURIComponent("http://localhost:3000/auth/box");

        let child = window.open("https://fancypantsgroup.app.box.com/api/oauth2/authorize" +
            "?response_type=code" +
            "&client_id=lz5d03ybnt9kc77bhwib4b4kc2i3e6kf" +
            "&redirect_uri=" + encodedRedirect, '', 'toolbar=0,status=0,width=626,height=436');
        let timer = setInterval(checkChild, 500);
        function checkChild() {
            if (child.closed) {
                alert("Child window closed");
                clearInterval(timer);
                // TODO: check if user has a valid token and update the UI
            }
        }
    }
}
