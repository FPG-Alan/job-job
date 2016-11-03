import {Component, OnInit} from "@angular/core";
import {TenKFtService} from "../../services/ten-k-ft.service";

@Component({
    selector: 'app-display-jobs',
    templateUrl: './display-jobs.component.html',
    styleUrls: ['./display-jobs.component.scss']
})
export class DisplayJobsComponent implements OnInit {

    jobs: any[] = [];

    constructor(private tenKFtService: TenKFtService) {
    }

    ngOnInit() {
        this.tenKFtService.getAllJobs()
            .subscribe(result => this.jobs = result.data)
    }

}
