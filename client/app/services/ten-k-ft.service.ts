import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {Headers, RequestOptions} from "@angular/http";
import {Job} from "../classes/job";

@Injectable()
export class TenKFtService {

    constructor(private authHttp: AuthHttp) {
    }

    /*********
     * USERS *
     *********/
    getAllUsers() {
        return this.authHttp.get("/user/all")
            .map(res => res.json());
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