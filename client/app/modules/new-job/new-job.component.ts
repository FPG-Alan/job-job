import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Job} from "../../classes/job";
import {TenKFtService} from "../../services/ten-k-ft.service";

declare var $;

@Component({
    selector: 'app-new-job',
    templateUrl: './new-job.component.html',
    styleUrls: ['./new-job.component.scss']
})
export class NewJobComponent implements OnInit {

    job: Job;

    constructor(private router: Router,
                private tenKFtService: TenKFtService) {
    }

    ngOnInit() {
        this.resetJobModel();
    }

    onSubmit(form: NgForm) {
        console.log(form.value);
        console.log(form.valid);
        // TODO: validation and set to untouched/clean to avoid spamming
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

    resetJobModel() {
        this.job = new Job("", null, "", null, "", "", "", "", null, "", "", []);
    }
}
