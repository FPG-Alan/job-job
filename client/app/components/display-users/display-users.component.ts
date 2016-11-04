import {Component, OnInit} from "@angular/core";
import {TenKFtService} from "../../services/ten-k-ft.service";

@Component({
    selector: 'app-display-users',
    templateUrl: 'display-users.component.html',
    styleUrls: ['display-users.component.scss']
})
export class DisplayUsersComponent implements OnInit {

    users: any[] = [];

    constructor(private tenKFtService: TenKFtService) {
    }

    ngOnInit() {
        this.tenKFtService.getAllUsers()
            .subscribe(
                result => this.users = result.data,
                err => console.log(err)
            )
    }

}
