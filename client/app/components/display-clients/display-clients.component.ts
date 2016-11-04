import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-display-clients',
    templateUrl: './display-clients.component.html',
    styleUrls: ['./display-clients.component.scss']
})
export class DisplayClientsComponent implements OnInit {

    clients: any[] = [];

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.apiService.getAllClients()
            .subscribe(
                result => this.clients = result,
                err => console.log(err)
            )
    }

}
