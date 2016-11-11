import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
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
            .map(res => res.json())
            .catch(this.handleError);
    }


    /********
     * JOBS *
     ********/
    getAllJobs() {
        return this.authHttp.get("/job/all")
            .map(res => res.json())
            .catch(this.handleError);
    }

    createNewJob(job: Job, finalName: string) {
        let body = job;
        body.name = finalName;
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.authHttp.post("/job", body, options)
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