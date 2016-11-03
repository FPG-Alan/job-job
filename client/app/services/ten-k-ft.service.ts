import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import {Observable} from "rxjs";
import {Response} from "@angular/http";

@Injectable()
export class TenKFtService {

    constructor(private authHttp: AuthHttp) {
    }

    getAllJobs() {
        return this.authHttp.get("/job/all")
            .map(res => res.json())
            .catch(this.handleError);
    }

    getAllUsers() {
        return this.authHttp.get("/user/all")
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