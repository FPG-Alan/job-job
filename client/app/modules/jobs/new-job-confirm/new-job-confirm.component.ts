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
    @Input() customFields: any;

    @Input() job: Job;
    @Input() finalName;
    @Input() slackChannelName: string;
    @Input() usingFinalName: boolean;

    @Output() onJobCreated = new EventEmitter<Job>();
    @Output() onFinished = new EventEmitter<boolean>();
    @Output() onClickCheckItOut = new EventEmitter<boolean>();
    private finished: boolean = false;
    private newJob: any = null;
    tenKProgress = {
        project: {
            status: "active",
            details: "Working..."
        },
        customFields: {
            status: "disabled",
            details: "Working..."
        },
        rateCard: {
            status: "disabled",
            details: "Working..."
        }
    };
    boxProgress = {
        client: {
            status: "disabled",
            details: "Working..."
        },
        job: {
            status: "disabled",
            details: "Working..."
        }
    };
    trelloProgress = {
        board: {
            status: "disabled",
            details: "Working..."
        }
    };
    slackProgress = {
        channel: {
            status: "disabled",
            details: "Working..."
        }
    };
    servicesCount: number = 0; // TODO: start timeInterval on when to stop
    // current number of features on the modal
    // 1. rate card (service increments in parent component)
    // 2. custom fields
    // 3. box
    // 4. trello
    // 5. slack
    private maxServicesCount: number = 5;
    private confirmInfo = {
        tenKUrl: null,
        boxUrl: null,
        trelloUrl: null
    }; // TODO: consider removing this with custom fields


    constructor(private commonService: CommonService,
                private apiService: ApiService) {
    }

    ngOnInit() {
        let submittedName = this.usingFinalName ? this.finalName.result : this.job.name;
        this.apiService.createNewJob(this.job, submittedName)
            .subscribe(
                res => {
                    this.tenKProgress.project = "completed";
                    this.requestRateCardChange(res);
                    this.newJob = res;
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
                    // emit an event to create custom field values
                    this.createCustomFieldValues(importantCustomValues);
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
                    this.onFinished.emit(this.finished);
                }, 1000);
                clearInterval(timeInterval);
            }
        }, 500)
    }


    /***************************
     * 10,000FT CUSTOM SERVICE *
     ***************************/
    /* Rate Card */
    requestRateCardChange(job: any) {
        this.onJobCreated.emit(job);
    }

    /* Custom Fields */
    private fillCustomFieldId(valueList) {
        // find same name custom field objects and inject custom field ID for those objects
        let valueWithIdList = valueList;
        for (let value of valueWithIdList) {
            let sameNameFields = this.customFields.filter(function isSameFieldName(field) {
                return value.name == field.name;
            });
            if (sameNameFields.length > 0) {
                value.custom_field_id = sameNameFields[0].id;
            }
        }
        return valueWithIdList;
    }

    createCustomFieldValues(valueList: any[]) {
        let valueWithIdList = this.fillCustomFieldId(valueList);
        // push the compiled custom field values
        this.apiService.createCustomFieldValues(
            this.newJob.id,
            valueWithIdList
        ).subscribe(
            res => console.log("Custom field values creation success:", res),
            err => this.commonService.handleError(err)
        )
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
                this.boxProgress.client = "active";
                folderName = this.job.client.name;
                nextType = "job";
            } else if (type == "job") {
                this.boxProgress.job = "active";
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
                                this.createCustomFieldValues(fieldValues);
                            }
                            this.boxProgress[type] = "completed";
                            let parentId = res.id;
                            this.createNewFolder(parentId, nextType);
                        },
                        err => {
                            this.servicesCount++;
                            this.boxProgress[type] = "failed";
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
                    this.createCustomFieldValues(fieldValues);
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

    checkItOut() {
        this.onClickCheckItOut.emit(this.finished);
    }
}
