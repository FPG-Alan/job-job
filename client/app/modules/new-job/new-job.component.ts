import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Job} from "../../classes/job";
import {Client} from "../../classes/client";
import {CommonService} from "../../services/common.service";
import {ApiService} from "../../services/api.service";
import {DatePipe} from "@angular/common";
import {RateCardSelectorComponent} from "./rate-card-selector/rate-card-selector.component";

declare var $;

@Component({
    selector: 'app-new-job',
    templateUrl: './new-job.component.html',
    styleUrls: ['./new-job.component.scss']
})
export class NewJobComponent implements OnInit, OnDestroy {

    @ViewChild(RateCardSelectorComponent)
    private rateCardSelectorComponent: RateCardSelectorComponent;

    submitted = false;
    job: Job;
    clients: Client[] = [];
    brands: string[] = [];
    finalName: any = {
        result: "",
        clientCode: "",
        startYear: "",
        projectCount: "001",
        brand: "",
        formattedName: ""
    };
    generating = false; // for loader to appear on the Generated Name field
    usingFinalName = true;

    returnedTenKJob: any = null; // for rate card selector

    constructor(private router: Router,
                private commonService: CommonService,
                private apiService: ApiService) {
    }

    ngOnInit() {
        $('.ui.checkbox').checkbox();
        $('.ui.search.dropdown.selection').dropdown();

        // SESSION STORAGE: check for prefilled or saved fields
        let savedJob = sessionStorage.getItem("saved_job_fields");
        let savedFinalName = sessionStorage.getItem("saved_final_name");
        if (savedJob && savedFinalName) {
            this.job = JSON.parse(savedJob);
            this.finalName = JSON.parse(savedFinalName);
            $("#client-select-field div.text")[0].innerText = this.commonService.isEmptyString(this.job.client.name)
                ? "(no client)"
                : this.job.client.name;
            $("#brand-select-field div.text")[0].innerText = this.commonService.isEmptyString(this.finalName.brand)
                ? "(no brand)"
                : this.finalName.brand;
        } else {
            this.resetModels();
        }
        this.apiService.getAllClients()
            .subscribe(
                res => this.clients = res,
                err => this.commonService.handleError(err)
            );
    }

    ngOnDestroy() {
        // avoid duplicate modals
        $("#confirm-reset-job").modal("hide");
        $("#confirm-reset-job").remove();
        $("#confirm-new-job").modal("hide");
        $("#confirm-new-job").remove();
    }


    /*******************
     * TWO-WAY BINDING *
     *******************/
    getClientProjectCount() {
        if (this.usingFinalName && !this.commonService.isEmptyString(this.job.client.name)) {
            this.generating = true;
            this.apiService
                .getClientProjectCount(
                    this.job.client.name,
                    new Date(this.job.startDate.toString()).getFullYear().toString())
                .subscribe(
                    res => {
                        console.log(res);
                        this.finalName.projectCount = res.formattedCount;
                        this.updateFinalName();
                        this.generating = false;
                    },
                    err => this.commonService.handleError(err)
                )
        }
    }

    updateFinalName() {
        // reinitiating as an empty string to make sure it's not a null addition
        this.finalName.result = "";
        this.finalName.result += !this.commonService.isEmptyString(this.finalName.clientCode)
            ? this.finalName.clientCode
            : "";
        // these will always be present
        this.finalName.result += this.finalName.startYear + this.finalName.projectCount;
        this.finalName.result += !this.commonService.isEmptyString(this.finalName.brand)
            ? "_" + this.finalName.brand
            : "";
        this.finalName.result += !this.commonService.isEmptyString(this.finalName.formattedName)
            ? "_" + this.finalName.formattedName
            : "";

        // SESSION STORAGE: update session storage at the end
        sessionStorage.setItem("saved_job_fields", JSON.stringify(this.job));
        sessionStorage.setItem("saved_final_name", JSON.stringify(this.finalName));

    }

    onJobNameChange() {
        this.finalName.formattedName = "";
        let words = this.job.name.match(/\S+/g);
        for (let w in words) {
            if (words.hasOwnProperty(w)) {
                words[w] = words[w].charAt(0).toUpperCase() + words[w].slice(1);
                this.finalName.formattedName += words[w];
            }
        }
        this.updateFinalName();
    }

    onClientChange() {
        this.job.brand = "";
        this.finalName.brand = "";
        this.finalName.projectCount = "001";
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
                words[w] = words[w].charAt(0).toUpperCase() + words[w].slice(1);
                this.finalName.brand += words[w];
            }
        }
        this.updateFinalName();
    }

    onDateChange(isStartEnd: string, strDate: string) {
        if (!this.commonService.isEmptyString(strDate)) {
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

    onRateUpdated(e: any) {
        console.log("RATE UPDATED!", e);
    }

    onSubmit(form: NgForm) {
        if (form.valid && !this.submitted) {
            // validation set to submitted to avoid spamming
            this.submitted = true;
            // compile what everything that hasn't been updated yet
            this.job.code = "" + this.finalName.clientCode + this.finalName.startYear + this.finalName.projectCount;

            let submittedName = this.usingFinalName ? this.finalName.result : this.job.name;
            this.apiService.createNewJob(this.job, submittedName)
                .subscribe(
                    res => {
                        console.log(res);
                        this.startFinalConfirmation();
                    },
                    err => this.commonService.handleError(err)
                );
        }
    }


    /***********************
     * RESETTING COMPONENT *
     **********************/
    confirmResetModels() {
        $("#confirm-reset-job")
            .modal("show");
    }

    resetModels() {
        // SESSION STORAGE: clear session storage when reset
        sessionStorage.removeItem("saved_job_fields");
        sessionStorage.removeItem("saved_final_name");

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
            projectCount: "001",
            brand: "",
            formattedName: ""
        };
        // calls to make sure; mainly for updating the start year
        this.onDateChange("start", strStartDate);

        this.updateFinalName();
    }

    /*****************************
     * FINAL CONFIRMATION SCREEN *
     *****************************/
    startFinalConfirmation() {
        // TODO: checkboxes opting user on these services
        // TODO: start timeInterval on when to stop
        // open modal for the workflow
        $("#confirm-new-job")
            .modal("show");
        this.rateCardSelectorComponent.updateBillRates();
        this.createNewFolder(null, "client");

        // } else {
        //     this.resetModels();
        //     this.commonService.notifyMessage(
        //         "success",
        //         "Sweet!",
        //         "Successfully created a new job"
        //     );
        //     this.router.navigate(["/"]);
        // }
    }

    /*******************
     * BOX INTEGRATION *
     *******************/
    /* the integration needs a full job object (due to 10Kft not saving Brands)
     and also needs the final name that gets submitted (generated name or custom name?)
     */

    processingStates: any = {
        client: "disabled",
        brand: "disabled",
        job: "disabled",
    };

    createNewFolder(parentFolderId: string, type: string) {
        // NOTE: feature is currently only for projects with clients
        // also check if the type is empty
        if (this.commonService.isEmptyString(this.job.client.name) ||
            this.commonService.isEmptyString(type)) {
            return;
        } else {
            var folderName = "";
            var nextType = "";

            if (type == "client") {
                this.processingStates.client = "active";
                folderName = this.job.client.name;
                // there are cases where brand name is empty
                nextType = !this.commonService.isEmptyString(this.job.brand) ? "brand" : "job";
            } else if (type == "brand") {
                this.processingStates.brand = "active";
                folderName = this.job.brand;
                nextType = "job";
            } else if (type == "job") {
                this.processingStates.job = "active";
                folderName = this.usingFinalName ? this.finalName.result : this.job.name;
                nextType = "confirm";
            } else if (type == "confirm") {
                // TODO: put this in a separate function
                // TODO: create an overlay animation above the steps when done
                setTimeout(() => {
                    this.resetModels();
                    $("#confirm-new-job")
                        .modal("hide");
                    this.commonService.notifyMessage(
                        "success",
                        "Sweet!",
                        "Successfully created a new job"
                    );
                    this.router.navigate(["/"]);
                }, 1000);
                return;
            } else return;

            // recursive folder creation
            if (!this.commonService.isEmptyString(folderName)) {
                this.apiService.createNewFolder(folderName, parentFolderId)
                    .subscribe(
                        res => {
                            this.processingStates[type] = "completed";
                            let parentId = res.id;
                            this.createNewFolder(parentId, nextType);
                        },
                        err => {
                            this.resetModels();
                            $("#confirm-new-job").modal("hide");
                            this.commonService.handleError(err);
                            // TODO: take the user the the Job's detail page
                        }
                    );
            }
        }
    }
}
