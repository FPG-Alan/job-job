import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";

declare var $;

@Injectable()
export class CommonService {

    constructor() {
    }

    notifyMessage(messageClass: string, messageHeader: string, messageContent: string) {
        $.notify({
            header: messageHeader,
            content: messageContent
        }, {
            className: [messageClass],
            autoHide: false,
            style: "custom",
            position: "bottom right",
            showDuration: 500,
            hideDuration: 500,
        });
    }

    isEmptyString(str: string) {
        return (!str || /^\s*$/.test(str));
    }

    handleError(error: Response | any) {
        // in a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            // custom notification
            this.notifyMessage(
                "error",
                body.header || "Something failed",
                body.message || ""
            );
        } else {
            errMsg = error.message ? error.message : error.toString();
            // custom notification
            this.notifyMessage(
                "error",
                "Something failed",
                errMsg || ""
            );
        }
        console.error(errMsg);


        return Observable.throw(errMsg);
    }
}
