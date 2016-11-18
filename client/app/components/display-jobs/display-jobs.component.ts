import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {CommonService} from "../../services/common.service";

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
                result => this.jobs = result.data,
                err => this.commonService.handleError(err)
            );
    }

    createNewTestFolder(folderName: string) {
        this.apiService.createNewTestFolder(folderName)
            .subscribe(
                res => console.log(res),
                err => this.commonService.handleError(err)
            );
    }
}
