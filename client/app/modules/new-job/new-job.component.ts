import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Job} from "../../classes/job";
import {Client} from "../../classes/client";
import {TenKFtService} from "../../services/ten-k-ft.service";
import {ApiService} from "../../services/api.service";
import {DatePipe} from "@angular/common";

declare var $;

@Component({
    selector: 'app-new-job',
    templateUrl: './new-job.component.html',
    styleUrls: ['./new-job.component.scss']
})
export class NewJobComponent implements OnInit {

    job: Job;
    clients: Client[] = [];
    submitted = false;
    finalName: any = {
        result: "",
        clientCode: "",
        startYear: "",
        projectCount: "01",
        brand: "",
        formattedName: ""
    };

    constructor(private router: Router,
                private tenKFtService: TenKFtService,
                private apiService: ApiService) {
    }

    ngOnInit() {
        this.resetJobModel();
        this.apiService.getAllClients()
            .subscribe(
                res => this.clients = res,
                err => console.log(err)
            );
    }

    onFinalNameChange() {
        this.finalName.result =
            this.finalName.clientCode
            + this.finalName.startYear
            + this.finalName.projectCount
            + this.finalName.brand
            + this.finalName.formattedName;
        console.log(this.finalName.result);
    }

    testOnJobNameChange(value: string) {
        let result = "";
        let words = value.split(" ");
        for (let w in words) {
            if (words.hasOwnProperty(w)) {
                console.log(w);
                // if (w > 0) { result += "_"; }
                words[w] = words[w].charAt(0).toUpperCase();
                result += words[w];
            }
        }
        return result;
    }

    onJobNameChange() {
        this.finalName.formattedName = "";
        let words = this.job.name.split(" ");
        for (let w in words) {
            if (words.hasOwnProperty(w)) {
                console.log(w);
                // if (w > 0) { this.finalName.formattedName += "_"; }
                words[w] = words[w].charAt(0).toUpperCase();
                this.finalName.formattedName += words[w];
            }
        }
    }

    onClientChange(value: any) {
        console.log(value);
        this.finalName.clientCode = value;
        this.onFinalNameChange();
    }

    onDateChange(isStartEnd: string, strDate: string) {
        if (!this.isEmptyString(strDate)) {
            if (isStartEnd === "start") {
                this.job.startDate = strDate;
                this.job.endDate = new Date(strDate) > new Date(this.job.endDate.toString())
                    ? strDate
                    : this.job.endDate;
            } else if (isStartEnd === "end") {
                this.job.endDate = strDate;
                this.job.startDate = new Date(strDate) < new Date(this.job.startDate.toString())
                    ? strDate
                    : this.job.startDate;
            }

            this.finalName.startYear =
                new Date(this.job.startDate.toString())
                    .getFullYear().toString().substr(2, 2);
            this.onFinalNameChange();

        }
    }

    onSubmit(form: NgForm) {
        console.log(form.value);
        console.log(form.valid);
        console.log(form);

        if (form.valid && !this.submitted) {
            // validation set to submitted to avoid spamming
            this.submitted = true;
            this.tenKFtService.createNewJob(this.job)
                .subscribe(
                    res => {
                        console.log(res);
                        this.resetJobModel();

                        // TODO: put this is a service
                        let $notifMessage = $("#notif-message");
                        $notifMessage.addClass("success");
                        $notifMessage.find(".header").html("Sweet!");
                        $notifMessage.find(".content").html("Successfully created a new job");
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
                        $notifMessage.find(".content").html("Could not create a new job");
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
                    });
        }
    }

    resetJobModel() {
        // preformat the date inputs
        let datePipe = new DatePipe("en-US");

        let startDate = new Date();
        let strStartDate = datePipe.transform(startDate.toString(), "yyyy-MM-dd");
        let endDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        let strEndDate = datePipe.transform(endDate.toString(), "yyyy-MM-dd");

        this.job = new Job("", null, "", null, "", "", "", "", null,
            strStartDate, strEndDate, []);
    }

    isEmptyString(text: string) {
        text = text != null ? text.trim() : null;
        return text === "" || text === null;
    }
}
