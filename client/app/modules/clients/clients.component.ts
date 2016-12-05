import {Component, OnInit} from "@angular/core";
import {Client} from "../../classes/client";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

    clients: Client[] = [];

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.apiService.getAllClients()
            .subscribe(
                res => this.clients = res,
                err => console.log(err)
            );
    }
}
