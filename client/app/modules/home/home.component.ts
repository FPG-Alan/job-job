import {Component, OnInit} from "@angular/core";
import {TenKFtService} from "../../services/ten-k-ft.service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private tenKFtService:TenKFtService) {
    }

    ngOnInit() {
    }

    getAllUsers(){
        this.tenKFtService.getAllUsers()
            .subscribe(res => console.log(res))
    }
}
