import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {User} from "../../classes/user";

@Component({
    selector: 'app-display-users',
    templateUrl: 'display-users.component.html',
    styleUrls: ['display-users.component.scss']
})
export class DisplayUsersComponent implements OnInit {

    users: User[] = [];

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.apiService.getAllUsers()
            .subscribe(
                res => this.users = res,
                err => console.log(err)
            );
    }

}
