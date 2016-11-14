import {Injectable} from "@angular/core";

declare var $;

@Injectable()
export class CommonService {

    constructor() {
    }

    notifyMessage(messageClass: string, messageHeader: string, messageContent) {
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
}
