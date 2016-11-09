import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private router: Router,
                private authService: AuthService) {
    }

    ngOnInit() {
        if (this.authService.authenticated()) {
            this.router.navigate(["/"])
        }
    }

}
