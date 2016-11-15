import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";

declare var $;

@Injectable()
export class CommonService {

    constructor() {
    }

    notifyMessage(messageClass: string, messageHeader: string, messageContent: string) {
        let $notifMessage = $("#notif-message");
        $notifMessage.addClass(messageClass);
        $notifMessage.find(".header").html(messageHeader);
        $notifMessage.find(".content").html(messageContent);
        $notifMessage.transition({
            animation: "fade",
            duration: "500ms"
        });
        setTimeout(function () {
            $notifMessage.transition({
                animation: "fade",
                duration: "500ms",
                onHide: function () {
                    $notifMessage.removeClass(messageClass);
                    $notifMessage.find(".header").empty();
                    $notifMessage.find(".content").empty();
                }
            });
        }, 4000);

    }

    isEmptyString(text: string) {
        if (text) {
            text = text.trim();
            return text === "" || text === null;
        } else {
            return true;
        }
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
                "Something failed",
                body.message
            );
        } else {
            errMsg = error.message ? error.message : error.toString();
            // custom notification
            this.notifyMessage(
                "error",
                "Something failed",
                errMsg
            );
        }
        console.error(errMsg);


        return Observable.throw(errMsg);
    }
}
