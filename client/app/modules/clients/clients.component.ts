import {Component, OnInit} from "@angular/core";
import {Client} from "../../classes/client";
import {ApiService} from "../../services/api.service";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";

declare var $;

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

    clients: Client[] = [];
    editClients: boolean[] = [];
    role: string;

    constructor(private apiService: ApiService,
                private commonService: CommonService,
                private authService: AuthService) {
        let profile = this.authService.profile;
        if (profile.app_metadata && profile.app_metadata.roles) {
            this.role = profile.app_metadata.roles[0];
        }
    }

    ngOnInit() {
        this.apiService.getAllClients()
            .subscribe(
                res => {
                    this.clients = res;
                    for (let c of this.clients) {
                        this.editClients.push(false)
                    }
                },
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

    editClient(index: number, newName: string) {
        // check if admin
        if (this.role == "admin" && this.clients[index]) {
            this.apiService.editClient(this.clients[index].name, newName)
                .subscribe(
                    res => {
                        this.clients[index] = res;
                        this.commonService.notifyMessage(
                            "success",
                            "Sweet!",
                            "Client name changed"
                        );
                    },
                    err => this.commonService.handleError(err)
                )
        }
        this.editClients[index] = false;
    }
}
