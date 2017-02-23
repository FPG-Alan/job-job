import {Component, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Job} from "../../../classes/job";
import {Client} from "../../../classes/client";
import {CommonService} from "../../../services/common.service";
import {ApiService} from "../../../services/api.service";
import {DatePipe} from "@angular/common";
import {RateCardSelectorComponent} from "../rate-card-selector/rate-card-selector.component";

declare var $;

@Component({
    selector: 'app-new-job',
    templateUrl: 'new-job.component.html',
    styleUrls: ['new-job.component.scss']
})
export class NewJobComponent implements OnInit, OnDestroy {

    @ViewChild('rateCardSelector')
    private rateCardSelectorComponent: RateCardSelectorComponent;

    clients: Client[] = [];
    producers: string[] = [];
    public serviceTypes = [
        {value: 'Site', display: 'Site'},
        {value: 'Banner', display: 'Banner'},
        {value: "", display: "Neither"}
    ];
    slackChannelName = "";
    customFields: any;
    customFieldValues = [];

    submitted = false;
    job: Job;
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

    constructor(private router: Router,
                private commonService: CommonService,
                private apiService: ApiService) {
    }

    ngOnInit() {
        $(".ui.checkbox").checkbox();
        $(".ui.search.dropdown.selection").dropdown();
        $(".popup-trigger").popup({
            on: "click",
            closable: false,
            lastResort: "right center"
        });
        $("#new-client-popup").popup({
            on: "click",
            closable: true,
            lastResort: "right center"
        });

        // SESSION STORAGE: check for prefilled or saved fields
        let savedJob = sessionStorage.getItem("saved_job_fields");
        let savedFinalName = sessionStorage.getItem("saved_final_name");
        if (savedJob && savedFinalName) {
            this.job = JSON.parse(savedJob);
            this.finalName = JSON.parse(savedFinalName);
            $("#client-select-field div.text")[0].innerText = this.commonService.isEmptyString(this.job.client.name)
                ? "(no client)"
                : this.job.client.name;
            $("#brand-select-field div.text")[0].innerText = this.commonService.isEmptyString(this.job.brand)
                ? "(no brand)"
                : this.job.brand;
        } else {
            this.resetModels();
        }
        this.apiService.getAllClients()
            .subscribe(
                res => this.clients = res,
                err => this.commonService.handleError(err)
            );
        this.getCustomFields();
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
                );
        }
    }

    addNewBrand(brand: string) {
        if (!this.commonService.isEmptyString(this.job.client.name)
            && !this.commonService.isEmptyString(brand)) {
            this.apiService
                .addNewBrand(this.job.client.name, brand)
                .subscribe(
                    res => {
                        console.log(res);
                        this.job.client.brands.push(brand);
                        this.job.brand = brand;
                        this.onBrandChange();
                        $("#brand-select-field div.text")[0].innerText = brand;
                        this.commonService.notifyMessage(
                            "success",
                            "Sweet!",
                            "Added a new brand for client: "
                            + "\"" + this.job.client.name + "\""
                        );
                        $("#new-brand-popup").popup("hide");
                    },
                    err => this.commonService.handleError(err)
                );
        } else {
            $("#new-brand-popup").popup("hide");
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

    onRateUpdated(processingState: string) {
        this.servicesCount++;
        this.rateCardProcessingState = processingState || "";
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
                        this.rateCardSelectorComponent.newJob = res;
                        this.confirmInfo.tenKUrl =
                            "https://vnext.10000ft.com/viewproject?id=" + res.id;
                        this.customFieldValues.push({
                            name: "Producer",
                            value: this.job.producer
                        }, {
                            name: "Type",
                            value: this.job.serviceType
                        });
                        this.startFinalConfirmation();
                    },
                    err => this.commonService.handleError(err)
                );
        }
    }


    /*****************
     * CUSTOM FIELDS *
     *****************/
    getCustomFields() {
        this.apiService.getCustomFields()
            .subscribe(
                res => {
                    this.customFields = res.data;
                    for (let field of this.customFields) {
                        if (field.name == "Producer") {
                            this.producers = field.options;
                            break;
                        }
                    }
                },
                err => this.commonService.handleError(err)
            )
    }

    /* Call this before creating new custom field values */
    private fillCustomFieldId() {
        for (let value of this.customFieldValues) {
            let sameNameFields = this.customFields.filter(function isSameFieldName(field) {
                console.log(value.name, field.name);
                return value.name == field.name;
            });
            if (sameNameFields.length > 0) {
                value.custom_field_id = sameNameFields[0].id;
            }
        }
    }

    private createCustomFieldValues() {
        console.log("Custom Field Values:", this.customFieldValues);
        this.apiService.createCustomFieldValues(
            this.rateCardSelectorComponent.newJob.id,
            this.customFieldValues)
            .subscribe(
                res => {
                    console.log("Custom field values creation success:", res);
                },
                err => this.commonService.handleError(err)
            )
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
        this.job = new Job("", newClient, "", null, "", "", "", "",
            strStartDate, strEndDate);

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
    rateCardProcessingState = "disabled";
    boxProcessingStates: any = {
        client: "disabled",
        brand: "disabled",
        job: "disabled"
    };
    trelloProcessingState = "disabled";
    slackProcessingState = "disabled";
    servicesCount: number = 0; // TODO: start timeInterval on when to stop
    maxServicesCount: number = 4; // current number of features on the modal
    canEndConfirm = false;
    confirmInfo = {
        tenKUrl: null,
        boxUrl: null,
        trelloUrl: null
    }; // TODO: replace this when we have custom fields

    private startFinalConfirmation() {
        this.rateCardProcessingState = "disabled";
        this.boxProcessingStates = {
            client: "disabled",
            brand: "disabled",
            job: "disabled"
        };
        this.servicesCount = 0;
        // open modal for the workflow
        $("#confirm-new-job")
            .modal("setting", "closable", false)
            .modal("show");
        setTimeout(() => {
            $("#confirm-new-job").modal("refresh");
        }, 100); // TODO: fix modal unscrollable at start

        // rate card progress UI
        this.rateCardProcessingState = "active";
        this.rateCardSelectorComponent.updateBillRates();
        this.createNewFolder(null, "client");
        if (!this.commonService.isEmptyString(this.job.serviceType)) {
            this.copyBoard(this.usingFinalName ? this.finalName.result : this.job.name, this.job.serviceType);
        } else { this.servicesCount++; }
        if (!this.commonService.isEmptyString(this.slackChannelName)) {
            this.createNewChannel(this.slackChannelName);
        } else { this.servicesCount++; }

        // TODO: put this in a separate function
        let timeInterval = setInterval(() => {
            if (this.servicesCount >= this.maxServicesCount) {
                setTimeout(() => {
                    this.resetModels();
                    this.canEndConfirm = true;

                    // push the compiled custom field values
                    this.fillCustomFieldId();
                    this.createCustomFieldValues();
                }, 1000);
                setTimeout(() => {
                    $("#confirm-new-job").modal("refresh");
                }, 1100);
                clearInterval(timeInterval);
            }
        }, 500)
    }

    endFinalConfirmation() {
        if (this.canEndConfirm) {
            $("#confirm-new-job")
                .modal({
                    onHidden: () => {
                        this.commonService.notifyMessage(
                            "success",
                            "Sweet!",
                            "Successfully created a new job"
                        );
                        this.router.navigate([
                            "/jobs/details",
                            this.rateCardSelectorComponent.newJob.id
                        ]);
                    }
                })
                .modal("hide");
        }
    }


    /*******************
     * BOX INTEGRATION *
     *******************/
    /* the integration needs a full job object (due to 10Kft not saving Brands)
     * and also needs the final name that gets submitted (generated name or custom name?)
     */
    createNewFolder(parentFolderId: string, type: string) {
        // NOTE: feature is currently only for projects with clients
        // also check if the type is empty
        if (this.commonService.isEmptyString(this.job.client.name) ||
            this.commonService.isEmptyString(type)) {
            this.servicesCount++;
            return;
        } else {
            var folderName = "";
            var nextType = "";

            if (type == "client") {
                this.boxProcessingStates.client = "active";
                folderName = this.job.client.name;
                // there are cases where brand name is empty
                nextType = !this.commonService.isEmptyString(this.job.brand) ? "brand" : "job";
            } else if (type == "brand") {
                this.boxProcessingStates.brand = "active";
                folderName = this.job.brand;
                nextType = "job";
            } else if (type == "job") {
                this.boxProcessingStates.job = "active";
                folderName = this.usingFinalName ? this.finalName.result : this.job.name;
                nextType = "confirm";
            } else {
                this.servicesCount++;
                $("#confirm-new-job").modal("refresh");
                return;
            }

            // recursive folder creation
            if (!this.commonService.isEmptyString(folderName)) {
                this.apiService.createNewFolder(folderName, parentFolderId)
                    .subscribe(
                        res => {
                            if (type == "job") {
                                this.confirmInfo.boxUrl =
                                    "https://fancypantsgroup.app.box.com/files/0/f/" + res.id;
                            }
                            this.boxProcessingStates[type] = "completed";
                            let parentId = res.id;
                            this.createNewFolder(parentId, nextType);
                        },
                        err => {
                            this.commonService.handleError(err);
                            this.servicesCount++;
                            $("#confirm-new-job").modal("refresh");
                        }
                    );
            }
        }
    }

    /**********************
     * TRELLO INTEGRATION *
     **********************/
    copyBoard(boardName, serviceType) {
        this.trelloProcessingState = "active";
        this.apiService.copyBoard(boardName, serviceType)
            .subscribe(
                res => {
                    this.trelloProcessingState = "completed";
                    this.confirmInfo.trelloUrl =
                        "https://trello.com/b/" + res.id;
                },
                err => {
                    this.trelloProcessingState = "failed";
                    this.commonService.handleError(err);
                },
                () => {
                    this.servicesCount++;
                    $("#confirm-new-job").modal("refresh");
                }
            )
    }

    /*********************
     * SLACK INTEGRATION *
     *********************/
    createNewChannel(channelName) {
        this.slackProcessingState = "active";
        this.apiService.createNewChannel(channelName)
            .subscribe(
                res => this.slackProcessingState = "completed",
                err => {
                    this.slackProcessingState = "failed";
                    this.commonService.handleError(err);
                },
                () => {
                    this.servicesCount++;
                    $("#confirm-new-job").modal("refresh");
                }
            );
    }
}
