import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {CommonService} from "../../services/common.service";

@Component({
    selector: 'app-new-rate-card',
    templateUrl: './new-rate-card.component.html',
    styleUrls: ['./new-rate-card.component.scss']
})
export class NewRateCardComponent implements OnInit {

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

    updateBillRates(templateId: number) {
        // get all rates with templateId
        this.apiService
            .getBillRates(templateId)
            .subscribe(
                res => {
                    console.log(res);
                    // for each job's rate
                    // filter where job.role == temp.role
                    // filter where job.discipline == temp.role
                    // filter where job.rate !== temp.role
                    // get the job.id from each result

                    // update bill rate where
                    //      id = job.id
                    //      rate = temp.rate
                },
                err => this.commonService.handleError(err)
            );


        // this.apiService
        //     .updateBillRates()
        //     .subscribe(
        //         res => console.log(res),
        //         err => this.commonService.handleError(err)
        //     );
    }
}
