import {Component, OnInit} from "@angular/core";
import {Client} from "../../classes/client";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-display-clients',
    templateUrl: './display-clients.component.html',
    styleUrls: ['./display-clients.component.scss']
})
export class DisplayClientsComponent implements OnInit {

    clients: Client[] = [];

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.apiService.getAllClients()
            .subscribe(
                res => this.clients = res,
                err => console.log(err)
            )
    }

}
