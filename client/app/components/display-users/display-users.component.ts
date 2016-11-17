import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-display-users',
    templateUrl: 'display-users.component.html',
    styleUrls: ['display-users.component.scss']
})
export class DisplayUsersComponent implements OnInit {

    users: any[] = [];

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.apiService.getAllUsers()
            .subscribe(
                result => this.users = result.data,
                err => console.log(err)
            );
    }

}
