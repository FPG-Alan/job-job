import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {Headers, RequestOptions} from "@angular/http";
import {Client} from "../classes/client";
import {Job} from "../classes/job";
import {User} from "../classes/user";

@Injectable()
export class ApiService {

    constructor(private authHttp: AuthHttp) {
    }


    /*********
     * USERS *
     *********/
    getAllUsers() {
        return this.authHttp.get("/user/all")
            .map(res => <User[]> res.json());
    }

    findOrCreateMyUser(user: User) {
        let body = user;
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.authHttp.post("/user", body, options)
            .map(res => <User> res.json());

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


    /********
     * JOBS *
     ********/
    getAllJobs() {
        return this.authHttp.get("/job/all")
            .map(res => res.json());
    }

    createNewJob(job: Job, finalName: string) {
        let body = {
            job: job,
            finalName: finalName
        };
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.authHttp.post("/job", body, options)
            .map(res => res.json());
    }
}
