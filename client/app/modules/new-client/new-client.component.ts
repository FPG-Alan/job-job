import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Client} from "../../classes/client";
import {ApiService} from "../../services/api.service";

declare var $;

@Component({
    selector: 'app-new-client',
    templateUrl: './new-client.component.html',
    styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {

    client: Client;
    submitted = false;
    currentBrand: string = "";

    constructor(private router: Router,
                private apiService: ApiService) {
    }

    ngOnInit() {
        this.resetClientModel();
    }

    addBrand() {
        this.client.brands.push(this.currentBrand);
        this.currentBrand = "";
    }

    removeBrand(index: number) {
        if (index > -1) {
            this.client.brands.splice(index, 1);
        }
    }

    onSubmit(form: NgForm) {
        console.log(form.value);
        console.log(form.valid);
        console.log(form);

        if (form.valid && !this.submitted) {
            this.submitted = true;
            this.apiService.createNewClient(this.client)
                .subscribe(
                    res => {
                        console.log(res);
                        this.resetClientModel();

                        // TODO: put this is a service
                        let $notifMessage = $("#notif-message");
                        $notifMessage.addClass("success");
                        $notifMessage.find(".header").html("Sweet!");
                        $notifMessage.find(".content").html("Successfully created a new client");
                        $notifMessage.transition({
                            animation: "fade",
                            duration: "500ms"
                        });
                        setTimeout(function () {
                            $notifMessage.transition({
                                animation: "fade",
                                duration: "500ms",
                                onHide: function () {
                                    $notifMessage.removeClass("success");
                                    $notifMessage.find(".header").empty();
                                    $notifMessage.find(".content").empty();
                                }
                            });
                        }, 4000);

                        this.router.navigate(["/"]);
                    },
                    err => {
                        let $notifMessage = $("#notif-message");
                        $notifMessage.addClass("error");
                        $notifMessage.find(".header").html("Something failed");
                        $notifMessage.find(".content").html("Could not create a new client");
                        $notifMessage.transition({
                            animation: "fade",
                            duration: "500ms"
                        });
                        setTimeout(function () {
                            $notifMessage.transition({
                                animation: "fade",
                                duration: "500ms",
                                onHide: function () {
                                    $notifMessage.removeClass("error");
                                    $notifMessage.find(".header").empty();
                                    $notifMessage.find(".content").empty();
                                }
                            });
                        }, 4000);
                    }
                )
        }
    }

    resetClientModel() {
        this.client = new Client("", "", "", 0, [])
    }

    isEmptyString(text: string) {
        text = text != null ? text.trim() : null;
        return text == "" || text == null;
    }
}
