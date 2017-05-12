import {Component, OnInit, OnDestroy, ViewChild, AfterViewInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Job} from "../../../classes/job";
import {Client} from "../../../classes/client";
import {CommonService} from "../../../services/common.service";
import {ApiService} from "../../../services/api.service";
import {DatePipe} from "@angular/common";
import {NewClientComponent} from "../../clients/new-client/new-client.component";
import {TrelloTemplateSelectorComponent} from "../trello-template-selector/trello-template-selector.component";
import {RateCardSelectorComponent} from "../rate-card-selector/rate-card-selector.component";
import {ConfirmComponent} from "../confirm/confirm.component";
import {SteveBotComponent} from "../../steve-bot/steve-bot.component";
import {AuthService} from "../../../services/auth.service";
import {SlackChannelNamePipe} from "../../../pipes/slack-channel-name.pipe";

declare var $;
declare var Typed;

@Component({
    selector: 'app-new-job',
    templateUrl: 'new-job.component.html',
    styleUrls: ['new-job.component.scss']
})
export class NewJobComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('newClient')
    private newClientComponent: NewClientComponent;
    @ViewChild('trelloTemplateSelector')
    private trelloTemplateSelectorComponent: TrelloTemplateSelectorComponent;
    @ViewChild('rateCardSelector')
    private rateCardSelectorComponent: RateCardSelectorComponent;
    @ViewChild('confirm')
    private confirmComponent: ConfirmComponent;
    @ViewChild('steveBot')
    private steveBotComponent: SteveBotComponent;

    // user data and settings
    userId: string = "";
    role: string;
    settings = {
        "steve": true
    };
    generating = false; // for loader to appear on the Generated Name field

    retrieveRemoteDataFailed: boolean = false;
    clients: Client[] = [];
    producers: string[] = [];
    serviceTypes: string[] = [];
    customFields: any;

    // passable data to children
    job: Job;
    finalName: any = {
        result: "",
        clientCode: "",
        startYear: "",
        projectCount: "000",
        brand: "",
        formattedName: ""
    };
    syncWithBoxApp = true;
    slackChannelName = "";
    usingFinalName = true;

    unsaved = false;
    submitted = false;

    constructor(private router: Router,
                private commonService: CommonService,
                private apiService: ApiService,
                private authService: AuthService) {
        let profile = this.authService.profile;
        this.userId = this.authService.profile.user_id;

        if (profile.app_metadata && profile.app_metadata.roles) {
            this.role = profile.app_metadata.roles[0];
        }

        // use localStorage settings if present, else use own
        if (localStorage.getItem("settings")) {
            this.settings = JSON.parse(localStorage.getItem("settings"));
            if (this.settings.steve == null) {
                this.settings.steve = true;
                localStorage.setItem("settings", JSON.stringify(this.settings));
            }
        } else {
            localStorage.setItem("settings", JSON.stringify(this.settings));
        }
    }

    ngOnInit() {
        // dropdown
        $(".ui.search.dropdown.selection").dropdown();
        $(".popup-trigger").popup({
            on: "click",
            lastResort: "right center"
        });

        this.resetModels();
        this.getClients();
        this.getCustomFields();
    }

    ngOnDestroy() {
        // avoid duplicate modals
        $("#confirm-reset-job").modal("hide");
        $("#confirm-reset-job").remove();
        $("#new-client-modal").modal("hide");
        $("#new-client-modal").remove();
    }

    refreshData() {
        this.retrieveRemoteDataFailed = false;
        this.getClients();
        this.getCustomFields();
        this.rateCardSelectorComponent.ngOnInit();
    }

    canDeactivate() {
        if (this.confirmComponent) {
            return this.confirmComponent.canDeactivate();
        } else {
            if (this.unsaved) {
                return window.confirm("You have unsaved changes. Are you sure?")
            }
            return true;
        }
    }

    ngAfterViewInit() {
        $("#client-select-field .dropdown.selection").dropdown({
            onShow: () => {
                this.steveBotComponent.sayOnce(
                    ["Try typing in dropdowns." +
                    " This experience saves you the near-infinite scrolling time."],
                    "client"
                )
            },
            selectOnKeydown: false
        });
    }

    /*********
     * STEVE *
     *********/
    onSteveStop(event: any) {
        // to make sure other settings are not overwritten, get first
        let localSettings = JSON.parse(localStorage.getItem("settings"));
        this.settings.steve = false;
        if (localSettings) {
            localSettings.steve = false;
        } else {
            // new localStorage settings
            localSettings = this.settings;
        }
        localStorage.setItem("settings", JSON.stringify(localSettings));
    }


    /*******************
     * TWO-WAY BINDING *
     *******************/
    /* JOB NUMBER */
    private getClientProjectCountRequest;

    getClientProjectCount() {
        if (this.getClientProjectCountRequest) {
            this.getClientProjectCountRequest.unsubscribe();
            this.generating = false;
        }
        if (this.usingFinalName && !this.commonService.isEmptyString(this.job.client.name)) {
            this.generating = true;
            this.getClientProjectCountRequest =
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

    /* ADD NEW CLIENT */
    addNewClient() {
        $("#new-client-modal")
            .modal("setting", "closable", false)
            .modal("show");
    }

    onNewClientCreated(event: any) {
        this.apiService.getAllClients()
            .subscribe(
                res => this.clients = res,
                err => this.commonService.handleError(err)
            );
        $("#new-client-modal").modal("hide");
    }

    onNewClientCancel(event: any) {
        $("#new-client-modal").modal("hide");
    }

    /* ADD NEW BRAND */
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

    /* FORM CHANGE HANDLERS */
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
        // remove bad characters
        this.finalName.result = this.finalName.result.replace(/(\/|\\)/g, "");
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
        this.finalName.projectCount = "000";
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
            let currentStartDate = new Date(this.job.startDate.toString());
            let currentEndDate = new Date(this.job.endDate.toString());
            let newDate = new Date(strDate);

            if (isStartEnd === "start") {
                this.job.startDate = strDate;
                // update endDate if new start date exceeds current end date
                this.job.endDate = newDate > currentEndDate
                    ? strDate
                    : this.job.endDate;
                // only get client proj count if start year is different
                // (prevents spamming server)
                if (currentStartDate.getFullYear().toString()
                    != newDate.getFullYear().toString()) {
                    this.getClientProjectCount();
                }
            } else if (isStartEnd === "end") {
                this.job.endDate = strDate;
                // update startDate if new end date is before current start date
                this.job.startDate = newDate < currentStartDate
                    ? strDate
                    : this.job.startDate;
                // only get client proj count if start year change is triggered
                // (prevents spamming server)
                if (currentStartDate.getFullYear().toString() != newDate.getFullYear().toString()
                    && newDate < currentStartDate) {
                    this.getClientProjectCount();
                }
            }
            // get the last 2 digits
            this.finalName.startYear =
                new Date(this.job.startDate.toString())
                    .getFullYear().toString().substr(2, 2);
            this.updateFinalName();
        }
    }

    onSlackChannelNameSelected(type: string) {
        if (type) {
            this.slackChannelName = new SlackChannelNamePipe()
                .transform(this.finalName.result, type);
        } else {
            return
        }
    }

    onSubmit(form: NgForm) {
        if (form.valid
            && !this.submitted
            && !this.commonService.isEmptyString(this.rateCardSelectorComponent.selectedTemplate)) {
            // compile what everything that hasn't been updated yet
            this.job.code = "" + this.finalName.clientCode + this.finalName.startYear + this.finalName.projectCount;

            // hide the form and display the confirmation
            this.submitted = true;
        }
    }

    /********************
     * AFTER SUBMISSION *
     ********************/
    onJobCreated(newJob: any) {
        this.rateCardSelectorComponent.newJob = newJob;
        this.rateCardSelectorComponent.updateBillRates();
        this.confirmComponent.tenKProgress.rateCard.status = "active";
    }

    onRateUpdated(processingState: string) {
        this.confirmComponent.servicesCount++;
        this.confirmComponent.tenKProgress.rateCard.status = processingState;
        if (this.rateCardSelectorComponent.selectedTemplate
            && !this.commonService.isEmptyString(
                this.rateCardSelectorComponent.selectedTemplate.name)) { // prevent undefined

            let fieldValues = [{
                name: "Rate Card",
                value: this.rateCardSelectorComponent.selectedTemplate.name
            }];
            this.confirmComponent.createCustomFieldValues(fieldValues, null);
        }
    }

    onRateUpdateFailed(err: any) {
        this.confirmComponent.servicesCount++;
        this.confirmComponent.handleError(err, "tenK", "rateCard");
        this.confirmComponent.tenKProgress.rateCard.status = "failed";
    }

    /*****************
     * CUSTOM FIELDS *
     *****************/
    private getClients() {
        this.apiService.getAllClients()
            .subscribe(
                res => this.clients = res,
                err => {
                    this.commonService.handleError(err);
                    this.retrieveRemoteDataFailed = true;
                }
            );
    }

    private getCustomFields() {
        this.apiService.getCustomFields()
            .subscribe(
                res => {
                    this.customFields = res.data;
                    for (let field of this.customFields) {
                        if (field.name == "Producer") {
                            this.producers = field.options;
                        } else if (field.name == "Type") {
                            this.serviceTypes = field.options;
                        }
                    }
                },
                err => {
                    this.commonService.handleError(err);
                    this.retrieveRemoteDataFailed = true;
                }
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
        // preformat to the date-type HTML inputs
        let datePipe = new DatePipe("en-US");
        let startDate = new Date();
        let strStartDate = datePipe.transform(startDate.toString(), "yyyy-MM-dd");
        let endDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        let strEndDate = datePipe.transform(endDate.toString(), "yyyy-MM-dd");
        let newClient = new Client("", "", "", []);
        this.job = new Job("", newClient, "", null, "", "", "", "",
            strStartDate, strEndDate);
        // reset Semantic select field text
        $("#client-select-field div.text")[0].innerText = "(select client)";
        $("#brand-select-field div.text")[0].innerText = "(no brand)";
        $("#producer-select-field div.text")[0].innerText = "(select producer)";
        this.rateCardSelectorComponent.selectedTemplate = null;
        this.rateCardSelectorComponent.onRateChanged();

        this.finalName = {
            result: "",
            clientCode: "",
            startYear: "",
            projectCount: "000",
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
    onFinished(finished: boolean) {
        if (finished) {
            this.resetModels();
            this.commonService.notifyMessage(
                "success",
                "Sweet!",
                "Successfully created a new job"
            );
        }
    }

    checkItOut(finished: boolean) {
        if (finished && this.rateCardSelectorComponent.newJob &&
            this.rateCardSelectorComponent.newJob.id) {
            this.submitted = false;
            // borrowing New Job ID from child seems dependant
            this.router.navigate([
                "/jobs/details",
                this.rateCardSelectorComponent.newJob.id
            ]);
        }
    }
}
