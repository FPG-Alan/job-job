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

    submitted = false;
    job: Job;
    clients: Client[] = [];
    brands: string[] = [];
    finalName: any = {
        result: "",
        clientCode: "",
        startYear: "",
        projectCount: "01",
        brand: "",
        formattedName: ""
    };
    usingFinalName = true;

    constructor(private router: Router,
                private tenKFtService: TenKFtService,
                private apiService: ApiService) {
    }

    ngOnInit() {
        this.resetModels();
        this.apiService.getAllClients()
            .subscribe(
                res => {
                    this.clients = res;
                },
                err => console.log(err)
            );

        $('.ui.checkbox').checkbox();
        $('.ui.search.dropdown.selection').dropdown();
    }

    getClientProjectCount() {
        if (this.usingFinalName && !this.isEmptyString(this.job.client.name)) {
            this.apiService
                .getClientProjectCount(
                    this.job.client.name,
                    new Date(this.job.startDate.toString()).getFullYear().toString())
                .subscribe(
                    res => {
                        console.log(res);
                        this.finalName.projectCount = res.formattedCount;
                        this.updateFinalName();
                    },
                    err => console.log(err)
                )
        }
    }

    updateFinalName() {
        // reinitiating as an empty string to make sure it's not a null addition
        this.finalName.result = "";
        this.finalName.result += !this.isEmptyString(this.finalName.clientCode)
            ? this.finalName.clientCode
            : "";
        // these will always be present
        // TODO: add leading 0 to project count
        this.finalName.result += this.finalName.startYear + this.finalName.projectCount;
        this.finalName.result += !this.isEmptyString(this.finalName.brand)
            ? "_" + this.finalName.brand
            : "";
        this.finalName.result += !this.isEmptyString(this.finalName.formattedName)
            ? "_" + this.finalName.formattedName
            : "";
    }

    onJobNameChange() {
        this.finalName.formattedName = "";
        let words = this.job.name.match(/\S+/g);
        for (let w in words) {
            if (words.hasOwnProperty(w)) {
                if (parseInt(w) > 0) { this.finalName.formattedName += "_"; }
                words[w] = words[w].charAt(0).toUpperCase() + words[w].slice(1);
                this.finalName.formattedName += words[w];
            }
        }
        this.updateFinalName();
    }

    onClientChange() {
        this.job.brand = "";
        this.finalName.brand = "";
        this.finalName.projectCount = "01";
        // update the text field generated by Semantic UI selection dropdown
        $("#brand-select-field div.text")[0].innerText = "(no brand)";

        this.finalName.clientCode = this.job.client.shortCode;

        this.getClientProjectCount();
        this.updateFinalName();
    }

    onBrandChange() {
        this.finalName.brand = "";
        let words = this.job.brand.match(/\S+/g);
        for (let w in words) {
            if (words.hasOwnProperty(w)) {
                if (parseInt(w) > 0) { this.finalName.brand += "_"; }
                words[w] = words[w].charAt(0).toUpperCase() + words[w].slice(1);
                this.finalName.brand += words[w];
            }
        }
        this.updateFinalName();
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
            // get the last 2 digits
            this.finalName.startYear =
                new Date(this.job.startDate.toString())
                    .getFullYear().toString().substr(2, 2);
            this.getClientProjectCount();

            this.updateFinalName();
        }
    }

    onSubmit(form: NgForm) {
        if (form.valid && !this.submitted) {
            // validation set to submitted to avoid spamming
            this.submitted = true;
            // compile what everything that hasn't been updated yet
            this.job.code = "" + this.finalName.clientCode + this.finalName.startYear + this.finalName.projectCount;

            let submittedName = this.usingFinalName ? this.finalName.result : this.job.name;
            this.tenKFtService.createNewJob(this.job, submittedName)
                .subscribe(
                    res => {
                        console.log(res);
                        this.resetModels();

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


    resetModels() {
        // preformat to the date-type HTML inputs
        let datePipe = new DatePipe("en-US");
        let startDate = new Date();
        let strStartDate = datePipe.transform(startDate.toString(), "yyyy-MM-dd");
        let endDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        let strEndDate = datePipe.transform(endDate.toString(), "yyyy-MM-dd");
        let newClient = new Client("", "", "", []);
        this.job = new Job("", newClient, "", null, "", "", "", "", null,
            strStartDate, strEndDate, []);

        this.finalName = {
            result: "",
            clientCode: "",
            startYear: "",
            projectCount: "01",
            brand: "",
            formattedName: ""
        };

        // reuse codes even more
        this.onDateChange("start", strStartDate);
        this.updateFinalName();
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
