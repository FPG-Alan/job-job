import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {ApiService} from "../../../services/api.service";
import {CommonService} from "../../../services/common.service";

declare var $;

@Component({
    selector: 'app-rate-card-selector',
    templateUrl: 'rate-card-selector.component.html',
    styleUrls: ['rate-card-selector.component.scss']
})
export class RateCardSelectorComponent implements OnInit {

    @Output() onTemplateRetrieveFailed = new EventEmitter<boolean>();
    @Output() onRateUpdated = new EventEmitter<string>();
    @Output() onRateUpdateFailed = new EventEmitter<any>();
    @Input() newJob: any = null; // input is being passed in on Details page
    newJobDefaultRates: any[] = [];
    selectedTemplate: any = null;
    templateCards: any[] = [];

    constructor(private apiService: ApiService,
                private commonService: CommonService) {
    }

    ngOnInit() {
        $(".ui.selection.dropdown").dropdown();

        this.apiService
            .getJobsByClient("1-FPG-REFERENCE")
            .subscribe(
                res => {
                    this.templateCards = res;
                    if (this.templateCards.length == 0) {
                        this.onTemplateRetrieveFailed.emit(true);
                    }
                },
                err => {
                    this.commonService.handleError({
                        header: "Failed to retrieve rate card templates",
                        message: "Please click the refresh button (if applicable) " +
                        "or manually reload this page"
                    });
                    this.onTemplateRetrieveFailed.emit(true);
                }
            );
    }

    onRateChanged() {
        $("#rate-card-select-field div.text")[0].innerText =
            !this.selectedTemplate || this.commonService.isEmptyString(this.selectedTemplate.name)
                ? "(select a rate card)"
                : this.selectedTemplate.name;
    }

    updateBillRates() {
        if (this.newJob && this.selectedTemplate) {
            this.apiService
                .getBillRates(this.newJob.id)
                .subscribe(
                    res => {
                        this.newJobDefaultRates = res.data;
                        this.applyNewBillRates();
                    },
                    err => this.commonService.handleError(err)
                );
        } else {
            this.onRateUpdated.emit("disabled");
        }
    }

    applyNewBillRates() {
        if (this.selectedTemplate.id && this.newJob && this.newJobDefaultRates) {
            // get all rates with template ID
            this.apiService
                .getBillRates(this.selectedTemplate.id)
                .subscribe(
                    res => {
                        let templateRates = res.data;

                        // for each current rate
                        //   filter where curr.role == temp.role
                        //   filter where curr.discipline == temp.role
                        //   filter where curr.rate != temp.rate
                        let toUpdateRates = []; // the rates that we will update
                        for (let currRate of this.newJobDefaultRates) {
                            let newRates = templateRates.filter(function (tempRate) {
                                return (tempRate.role_id == currRate.role_id) &&
                                    (tempRate.discipline_id == currRate.discipline_id) &&
                                    (parseFloat(tempRate.rate) != parseFloat(currRate.rate))
                            });
                            if (newRates.length != 0) {
                                // update bill rate where
                                //   id = curr.id
                                //   rate = matched.rate
                                for (let n of newRates) {
                                    toUpdateRates.push({
                                        id: currRate.id,
                                        rate: parseFloat(n.rate)
                                    });
                                }
                            }
                        }
                        console.log("To override:", toUpdateRates);

                        this.apiService.updateBillRates(this.newJob.id, toUpdateRates)
                            .subscribe(
                                res => this.onRateUpdated.emit("completed"),
                                err => this.onRateUpdateFailed.emit(err)
                            );
                    },
                    err => this.commonService.handleError(err)
                );
        } else {
            this.onRateUpdated.emit("failed");
        }
    }
}
