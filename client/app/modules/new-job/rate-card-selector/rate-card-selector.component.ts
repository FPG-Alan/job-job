import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {ApiService} from "../../../services/api.service";
import {CommonService} from "../../../services/common.service";

@Component({
    selector: 'app-rate-card-selector',
    templateUrl: './rate-card-selector.component.html',
    styleUrls: ['./rate-card-selector.component.scss']
})
export class RateCardSelectorComponent implements OnInit {

    @Output() onRateUpdated = new EventEmitter<any>();
    @Input() newJob: any;
    newJobDefaultRates: any[] = [];
    templateId: number = null;
    templateCards: any[] = [];

    constructor(private apiService: ApiService,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.apiService
            .getJobsByClient("1-FPG-REFERENCE")
            .subscribe(
                res => this.templateCards = res,
                err => this.commonService.handleError(err)
            );
    }

    updateBillRates() {
        console.log(this.newJob);
        if (this.newJob && this.templateId) {
            this.apiService
                .getBillRates(this.newJob.id)
                .subscribe(
                    res => {
                        this.newJobDefaultRates = res.data;
                        this.applyNewBillRates();
                    },
                    err => this.commonService.handleError(err)
                );
        }
    }

    applyNewBillRates() {
        if (this.templateId && this.newJob && this.newJobDefaultRates) {
            // get all rates with templateId
            this.apiService
                .getBillRates(this.templateId)
                .subscribe(
                    res => {
                        let templateRates = res.data;

                        // for each current rate
                        //      filter where curr.role == temp.role
                        //      filter where curr.discipline == temp.role
                        //      filter where curr.rate != temp.rate
                        let toUpdateRates = []; // the rates that we will update
                        for (let currRate of this.newJobDefaultRates) {
                            let newRates = templateRates.filter(function (tempRate) {
                                return (tempRate.role_id == currRate.role_id) &&
                                    (tempRate.discipline_id == currRate.discipline_id) &&
                                    (parseFloat(tempRate.rate) != parseFloat(currRate.rate))
                            });
                            if (newRates.length != 0) {
                                // update bill rate where
                                //      id = curr.id
                                //      rate = matched.rate
                                for (let n of newRates) {
                                    toUpdateRates.push({
                                        id: currRate.id,
                                        rate: parseFloat(n.rate)
                                    });
                                }
                            }
                        }
                        console.log(toUpdateRates);

                        this.apiService.updateBillRates(this.newJob.id, toUpdateRates)
                            .subscribe(
                                res => {
                                    console.log(res);
                                    this.ngOnInit();
                                },
                                err => this.commonService.handleError(err)
                            );
                    },
                    err => this.commonService.handleError(err)
                );
        }
    }
}
