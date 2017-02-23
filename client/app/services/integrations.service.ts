import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class IntegrationsService {

    constructor(private authHttp: AuthHttp) {
    }
    // TODO: bring integrations API calls from api.service
}
