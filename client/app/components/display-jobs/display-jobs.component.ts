import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {CommonService} from "../../services/common.service";

declare var $;

@Component({
    selector: 'app-display-jobs',
    templateUrl: './display-jobs.component.html',
    styleUrls: ['./display-jobs.component.scss']
})
export class DisplayJobsComponent implements OnInit {

    jobs: any[] = [];

    constructor(private apiService: ApiService,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.apiService.getAllJobs()
            .subscribe(
                result => {
                    this.jobs = result.data;
                    console.log(this.jobs)
                },
                err => this.commonService.handleError(err)
            );
    }
}
