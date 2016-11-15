import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {Headers, RequestOptions} from "@angular/http";
import {Client} from "../classes/client";

@Injectable()
export class ApiService {

    constructor(private authHttp: AuthHttp) {
    }

    /***********
     * CLIENTS *
     ***********/
    getAllClients() {
        return this.authHttp.get("/client/all")
            .map(res => <Client[]> res.json())
    }

    createNewClient(client: Client) {
        let body = client;
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.authHttp.post("/client", body, options)
            .map(res => res.json());
    }

    getClientProjectCount(clientName: string, year: string) {
        return this.authHttp.get("/client/count-by-year/" + clientName + "/" + year)
            .map(res => res.json())
    }
}
