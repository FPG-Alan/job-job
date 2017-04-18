import {Component, OnInit, EventEmitter, Output, Input} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
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
    @Output() onJobCreateFailed = new EventEmitter<boolean>();
    @Output() onFinished = new EventEmitter<boolean>();
    @Output() onClickCheckItOut = new EventEmitter<boolean>();
    private finished: boolean = false;
    private hasError: boolean = false;
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
                    this.tenKProgress.project.status = "completed";
                    // rate cards
                    this.requestRateCardChange(res);
                    this.newJob = res;
                    this.confirmInfo.tenKUrl =
                        "https://vnext.10000ft.com/viewproject?id=" + res.id;
                    // custom values
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
                    this.createCustomFieldValues(importantCustomValues, "customFields");
                    // start integrations
                    this.startIntegrations();

                    let timeInterval = setInterval(() => {
                        if (this.servicesCount >= this.maxServicesCount) {
                            setTimeout(() => {
                                this.finished = true;
                                this.onFinished.emit(this.finished);
                            }, 1000);
                            clearInterval(timeInterval);
                        }
                    }, 500)
                },
                err => {
                    // don't do anything if project isn't created on 10,000ft
                    this.commonService.handleError(err);
                    this.onJobCreateFailed.emit(true);
                }
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
    }

    checkItOut() {
        this.onClickCheckItOut.emit(this.finished);
    }

    handleError(error: Response | any, service: string, type: string) {
        this.hasError = true;
        // in a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;

            // display error on specific progress display
            let customError = (body.header || "Something failed");
            customError += body.message ? ". " + body.message : "";
            this.setProgressDetails(customError, service, type);
        } else {
            errMsg = error.message ? error.message : error.toString();

            // display error on specific progress display
            let customError = "Something failed. " + errMsg || "";
            this.setProgressDetails(customError, service, type);
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    private setProgressDetails(message: string, service: string, type: string) {
        if (service == "tenK" && this.tenKProgress[type]) {
            this.tenKProgress[type].details = message;
        } else if (service == "box" && this.boxProgress[type]) {
            this.boxProgress[type].details = message;
        } else if (service == "trello" && this.trelloProgress[type]) {
            this.trelloProgress[type].details = message;
        } else if (service == "slack" && this.slackProgress[type]) {
            this.slackProgress[type].details = message;
        }
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

    createCustomFieldValues(valueList: any[], type: string) {
        if (this.newJob && this.newJob.id) {
            let valueWithIdList = this.fillCustomFieldId(valueList);
            // push the compiled custom field values
            this.apiService.createCustomFieldValues(
                this.newJob.id,
                valueWithIdList
            ).subscribe(
                res => {
                    this.servicesCount++;
                    if (type == "customFields") this.tenKProgress.customFields.status = "completed";
                },
                err => {
                    this.servicesCount++;
                    if (type == "customFields") this.handleError(err, "tenK", "customFields");
                    console.log(err)
                }
            )
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
                this.boxProgress.client.status = "active";
                folderName = this.job.client.name;
                nextType = "job";
            } else if (type == "job") {
                this.boxProgress.job.status = "active";
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
                                this.createCustomFieldValues(fieldValues, null);
                            }
                            if (this.boxProgress[type]) this.boxProgress[type].status = "completed";
                            let parentId = res.id;
                            this.createNewFolder(parentId, nextType);
                        },
                        err => {
                            this.servicesCount++;
                            if (this.boxProgress[type]) this.boxProgress[type].status = "failed";
                            this.handleError(err, "box", type);
                        }
                    );
            }
        }
    }

    /**********************
     * TRELLO INTEGRATION *
     **********************/
    copyBoard(boardName, serviceType) {
        this.trelloProgress.board.status = "active";
        this.apiService.copyBoard(this.userId, boardName, serviceType)
            .subscribe(
                res => {
                    this.servicesCount++;
                    this.trelloProgress.board.status = "completed";
                    this.confirmInfo.trelloUrl =
                        "https://trello.com/b/" + res.id;
                    let fieldValues = [{
                        name: "Trello Location",
                        value: this.confirmInfo.trelloUrl
                    }];
                    this.createCustomFieldValues(fieldValues, null);
                },
                err => {
                    this.servicesCount++;
                    this.trelloProgress.board.status = "failed";
                    this.handleError(err, "trello", "board");
                }
            );
    }

    /*********************
     * SLACK INTEGRATION *
     *********************/
    createNewChannel(channelName) {
        this.slackProgress.channel.status = "active";
        this.apiService.createNewChannel(this.userId, channelName)
            .subscribe(
                res => {
                    this.servicesCount++;
                    this.slackProgress.channel.status = "completed";
                },
                err => {
                    this.servicesCount++;
                    this.slackProgress.channel.status = "failed";
                    this.handleError(err, "slack", "channel");
                }
            );
    }
}
