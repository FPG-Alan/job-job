import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";

@Component({
    selector: 'app-display-jobs',
    templateUrl: './display-jobs.component.html',
    styleUrls: ['./display-jobs.component.scss']
})
export class DisplayJobsComponent implements OnInit {

    jobs: any[] = [];

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.apiService.getAllJobs()
            .subscribe(
                result => this.jobs = result.data,
                err => console.log(err)
            );
    }

}
