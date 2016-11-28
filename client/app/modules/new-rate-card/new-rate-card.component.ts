import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {CommonService} from "../../services/common.service";

@Component({
    selector: 'app-new-rate-card',
    templateUrl: './new-rate-card.component.html',
    styleUrls: ['./new-rate-card.component.scss']
})
export class NewRateCardComponent implements OnInit {

    constructor(private apiService: ApiService,
                private commonService: CommonService) {
    }

    ngOnInit() {
    }

    testBillRates() {
        this.apiService
            .getAccountBillRates()
            .subscribe(
                res => console.log(res),
                err => this.commonService.handleError(err)
            )
    }
}
