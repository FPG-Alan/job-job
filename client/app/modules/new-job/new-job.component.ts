import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Job} from "../../classes/job";
import {TenKFtService} from "../../services/ten-k-ft.service";
import {DatePipe} from "@angular/common";

declare var $;

@Component({
    selector: 'app-new-job',
    templateUrl: './new-job.component.html',
    styleUrls: ['./new-job.component.scss']
})
export class NewJobComponent implements OnInit {

    job: Job;
    submitted = false;
    finalName: string = "";

    constructor(private router: Router,
                private tenKFtService: TenKFtService) {
    }

    ngOnInit() {
        this.resetJobModel();
    }

    onDateChange(isStartEnd: string, strDate: string) {
        console.log(strDate);
        if (!this.isEmptyString(strDate)) {
            if (isStartEnd == "start") {
                this.job.startDate = strDate;
                this.job.endDate = new Date(strDate) > new Date(this.job.endDate.toString())
                    ? strDate
                    : this.job.endDate;
            } else if (isStartEnd == "end") {
                this.job.endDate = strDate;
                this.job.startDate = new Date(strDate) < new Date(this.job.startDate.toString())
                    ? strDate
                    : this.job.startDate;
            }
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

                        this.router.navigate(["/home"]);
                    },
                    err => {
                        let $notifMessage = $("#notif-message");
                        $notifMessage.addClass("error");
                        $notifMessage.find(".header").html("Something failed!");
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
                    })
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
        return text == "" || text == null;
    }
}
