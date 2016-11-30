import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {CommonService} from "../../services/common.service";

@Component({
    selector: 'app-new-rate-card',
    templateUrl: './new-rate-card.component.html',
    styleUrls: ['./new-rate-card.component.scss']
})
export class NewRateCardComponent implements OnInit {

    currentJob: any = null;
    currentRates: any[] = [];
    templateCards: any[] = [];

    constructor(private apiService: ApiService,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.apiService
            .getJobById(183141)
            .subscribe(
                res => {
                    this.currentJob = res;
                    this.apiService
                        .getBillRates(this.currentJob.id)
                        .subscribe(
                            res => this.currentRates = res.data,
                            err => this.commonService.handleError(err)
                        )
                },
                err => this.commonService.handleError(err)
            );
        this.apiService
            .getJobsByClient("1-FPG-REFERENCE")
            .subscribe(
                res => this.templateCards = res,
                err => this.commonService.handleError(err)
            );
    }

    updateBillRates(templateId: number) {
        if (templateId) {
            // get all rates with templateId
            this.apiService
                .getBillRates(templateId)
                .subscribe(
                    res => {
                        console.log(res);
                        let templateRates = res.data;
                        // for each job's rate
                        // filter where curr.role == temp.role
                        // filter where curr.discipline == temp.role
                        // filter where curr.rate !== temp.role
                        // get the job.id from each result
                        let toUpdateRates = []; // the rates that we will update
                        for (let currRate of this.currentRates) {
                            let newRates = templateRates.filter(function(tempRate){
                                return (tempRate.role_id == currRate.role_id) &&
                                    (tempRate.discipline_id == currRate.discipline_id) &&
                                    (parseFloat(tempRate.rate) != parseFloat(currRate.rate))
                            });
                            if (newRates.length != 0){
                                // update bill rate where
                                //      id = curr.id
                                //      rate = matched.rate
                                for (let n of newRates){
                                    toUpdateRates.push({
                                        id: currRate.id,
                                        rate: parseFloat(n.rate)
                                    });
                                }
                            }
                        }
                        console.log(toUpdateRates);

                        this.apiService.updateBillRates(this.currentJob.id, toUpdateRates)
                            .subscribe(
                                res => console.log(res),
                                err => this.commonService.handleError(err)
                            );
                    },
                    err => this.commonService.handleError(err)
                );
        }
    }
}
