import {Component, OnInit, EventEmitter, Output, Input} from "@angular/core";
import {ApiService} from "../../../services/api.service";
import {CommonService} from "../../../services/common.service";
import {Job} from "../../../classes/job";

@Component({
    selector: 'app-new-job-confirm',
    templateUrl: './new-job-confirm.component.html',
    styleUrls: ['./new-job-confirm.component.scss']
})
export class NewJobConfirmComponent implements OnInit {

    @Input() userId: string;
    @Input() job: Job;
    @Input() finalName;
    @Input() slackChannelName: string;
    @Input() usingFinalName: boolean;

    @Output() onCustomFieldCreateRequest = new EventEmitter<any[]>();
    @Output() onFinished = new EventEmitter<boolean>();
    finished: boolean = false;
    rateCardProcessingState = "disabled";
    boxProcessingStates: any = {
        client: "disabled",
        job: "disabled"
    };
    trelloProcessingState = "disabled";
    slackProcessingState = "disabled";

    servicesCount: number = 0; // TODO: start timeInterval on when to stop
    maxServicesCount: number = 3; // current number of features on the modal
    confirmInfo = {
        tenKUrl: null,
        boxUrl: null,
        trelloUrl: null
    }; // TODO: consider removing this with custom fields

    constructor(private commonService: CommonService,
                private apiService: ApiService) {
        // TODO: wait for 10k first
    }

    ngOnInit() {
        let submittedName = this.usingFinalName ? this.finalName.result : this.job.name;
        this.apiService.createNewJob(this.job, submittedName)
            .subscribe(
                res => {
                    // TODO: this.rateCardSelectorComponent.newJob = res;
                    this.confirmInfo.tenKUrl =
                        "https://vnext.10000ft.com/viewproject?id=" + res.id;
                    let importantCustomValues = [{
                        name: "Brand",
                        value: this.job.brand
                    }, {
                        name: "Producer",
                        value: this.job.producer
                    }, {
                        name: "Type",
                        value: this.job.serviceType
                    }];
                    // TODO: emit an event to edit bill rates
                    // TODO: this.rateCardSelectorComponent.updateBillRates();
                    // emit an event to create custom field values
                    // TODO: display progress
                    this.onCustomFieldCreateRequest.emit(importantCustomValues);
                    // start integrations
                    this.startIntegrations();
                },
                err => this.commonService.handleError(err)
            );
    }

    startIntegrations() {
        // Box
        this.createNewFolder(null, "client");
        // Trello
        if (!this.commonService.isEmptyString(this.job.serviceType)) {
            this.copyBoard(this.usingFinalName ? this.finalName.result : this.job.name, this.job.serviceType);
        } else { this.servicesCount++; }
        // Slack
        if (!this.commonService.isEmptyString(this.slackChannelName)) {
            this.createNewChannel(this.slackChannelName);
        } else { this.servicesCount++; }

        let timeInterval = setInterval(() => {
            if (this.servicesCount >= this.maxServicesCount) {
                setTimeout(() => {
                    this.finished = true;
                }, 1000);
                clearInterval(timeInterval);
            }
        }, 500)
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
                nextType = "job";
            } else if (type == "job") {
                this.boxProcessingStates.job = "active";
                folderName = this.usingFinalName ? this.finalName.result : this.job.name;
                nextType = "confirm";
            } else {
                this.servicesCount++;
                return;
            }

            // recursive folder creation
            if (!this.commonService.isEmptyString(folderName)) {
                this.apiService.createNewFolder(this.userId, folderName, parentFolderId)
                    .subscribe(
                        res => {
                            if (type == "job") {
                                this.confirmInfo.boxUrl =
                                    "https://fancypantsgroup.app.box.com/files/0/f/" + res.id;
                                let fieldValues = [{
                                    name: "Box Location",
                                    value: this.confirmInfo.boxUrl
                                }];
                                this.onCustomFieldCreateRequest.emit(fieldValues);
                            }
                            this.boxProcessingStates[type] = "completed";
                            let parentId = res.id;
                            this.createNewFolder(parentId, nextType);
                        },
                        err => {
                            this.servicesCount++;
                            this.boxProcessingStates[type] = "failed";
                            this.commonService.handleError(err);
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
        this.apiService.copyBoard(this.userId, boardName, serviceType)
            .subscribe(
                res => {
                    this.servicesCount++;
                    this.trelloProcessingState = "completed";
                    this.confirmInfo.trelloUrl =
                        "https://trello.com/b/" + res.id;
                    let fieldValues = [{
                        name: "Trello Location",
                        value: this.confirmInfo.trelloUrl
                    }];
                    this.onCustomFieldCreateRequest.emit(fieldValues);
                },
                err => {
                    this.servicesCount++;
                    this.trelloProcessingState = "failed";
                    this.commonService.handleError(err);
                },
                () => {
                    console.log("Trello's done")
                }
            );
    }

    /*********************
     * SLACK INTEGRATION *
     *********************/
    createNewChannel(channelName) {
        this.slackProcessingState = "active";
        this.apiService.createNewChannel(this.userId, channelName)
            .subscribe(
                res => {
                    this.servicesCount++;
                    this.slackProcessingState = "completed";
                },
                err => {
                    this.servicesCount++;
                    this.slackProcessingState = "failed";
                    this.commonService.handleError(err);
                },
                () => {
                    console.log("Slack's done")
                }
            );
    }
}
