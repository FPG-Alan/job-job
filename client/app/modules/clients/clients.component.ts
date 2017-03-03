import {Component, OnInit} from "@angular/core";
import {Client} from "../../classes/client";
import {ApiService} from "../../services/api.service";

declare var $;

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

    ngOnDestroy() {
        $("#new-client-modal").modal("hide");
        $("#new-client-modal").remove();
    }

    addNewClient() {
        $("#new-client-modal")
            .modal("setting", "closable", false)
            .modal("show");
    }

    onNewClientCreated(event: any) {
        this.ngOnInit();
        $("#new-client-modal").modal("hide");
    }

    onNewClientCancel(event: any) {
        $("#new-client-modal").modal("hide");
    }
}
