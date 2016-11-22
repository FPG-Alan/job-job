import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {CommonService} from "../../services/common.service";
import {Client} from "../../classes/client";

declare var $;

@Component({
    selector: 'app-display-jobs',
    templateUrl: './display-jobs.component.html',
    styleUrls: ['./display-jobs.component.scss']
})
export class DisplayJobsComponent implements OnInit {

    jobs: any[] = [];
    clients: Client[] = [];
    filtering: boolean = false;

    constructor(private apiService: ApiService,
                private commonService: CommonService) {
    }

    ngOnInit() {
        $(".ui.multiple.selection.dropdown").dropdown();

        this.apiService.getAllJobs()
            .subscribe(
                result => {
                    this.jobs = result.data;
                    console.log(this.jobs)
                },
                err => this.commonService.handleError(err)
            );
        this.apiService.getAllClients()
            .subscribe(
                result => {
                    this.clients = result;
                    console.log(this.clients)
                },
                err => this.commonService.handleError(err)
            );
    }

    onFilterSearchChange(e: any){
        this.filtering = true;
        console.log(e)
    }
}
