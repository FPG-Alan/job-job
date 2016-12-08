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

    /************
     * SETTINGS *
     ************/
    getBoxAuthParams() {
        return this.authHttp.get("/auth/box/auth-params")
            .map(res => res.json());
    }

    /*********
     * USERS *
     *********/
    getMyUser(userId: string) {
        return this.authHttp.get("/user/?id=" + userId)
            .map(res => <User> res.json())
    }

    getOrCreateMyUser(user: User) {
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
        return this.authHttp.get("/client/count-by-year?client=" + clientName + "&year=" + year)
            .map(res => res.json())
    }

    addNewBrand(clientName: string, brand: string) {
        let body = {
            client: clientName,
            brand: brand
        };
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.authHttp.post("/client/brand", body, options)
            .map(res => res.json());
    }


    /********
     * JOBS *
     ********/
    getAllJobs() {
        // TODO: map res.data, not just res
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

    getJobById(id: number | string) {
        return this.authHttp.get("/job/by-id/" + id)
            .map(res => res.json())
    }

    getJobsByClient(clientName: string) {
        return this.authHttp.get("/job/by-client/" + clientName)
            .map(res => res.json())
    }

    /*******************
     * BILL RATE CARDS *
     *******************/
    getBillRates(templateId: number | string) {
        return this.authHttp.get("/rate-card/" + templateId)
            .map(res => res.json())
    }

    updateBillRates(jobId: number | string, rates: any[]) {
        let body = {
            rates: rates
        };
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.authHttp.put("/rate-card/" + jobId, body, options)
            .map(res => res.json())
    }

    /******************
     * TAGS/PRODUCERS *
     ******************/
    getAllTags() {
        return this.authHttp.get("/tag/all")
            .map(res => res.json())
    }

    addNewTag(tag: string) {
        let body = {tag: tag};
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.authHttp.post("/tag", body, options)
            .map(res => res.json())
    }

    attachTagToProject(){
        // TODO
    }


    /*******************
     * BOX INTEGRATION *
     *******************/
    createNewFolder(folderName: any, parentFolderId: string) {
        // get user info to retrieve security tokens
        let userId = "";
        let localProfile = JSON.parse(localStorage.getItem("profile"));
        if (localProfile) userId = localProfile.user_id;

        let body = {
            userId: userId,
            folderName: folderName,
            parentFolderId: parentFolderId
        };
        let headers = new Headers({"Content-Type": "application/json"});
        let options = new RequestOptions({headers: headers});

        return this.authHttp.post("/box", body, options)
            .map(res => res.json());
    }
}
