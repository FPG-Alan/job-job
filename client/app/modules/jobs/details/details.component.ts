import {Component, OnInit} from "@angular/core";
import {Params, ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {CommonService} from "../../../services/common.service";

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

    job: any;
    selectingRateCard: boolean = false;

    constructor(private apiService: ApiService,
                private commonService: CommonService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.apiService.getJobById(+params['id']))
            .subscribe(
                job => {
                    this.job = job;
                    console.log(job)
                },
                err => this.commonService.handleError(err)
            );
    }
}
