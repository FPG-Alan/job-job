import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
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
            .map(res => res.json())
            .catch(this.handleError);
    }

    createNewClient(client: Client) {
        let body = client;
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.authHttp.post("/client", body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
