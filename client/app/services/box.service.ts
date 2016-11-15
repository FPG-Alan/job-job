import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";

@Injectable()
export class BoxService {

    constructor(private authHttp: AuthHttp) {
    }

    authTest() {
        return this.authHttp.get("/auth/box")
            .map(res => res.json())
    }
}
