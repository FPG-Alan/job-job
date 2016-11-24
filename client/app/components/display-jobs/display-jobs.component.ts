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
    displayedJobs: any[] = [];
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
                    this.onFilterSearchChange(""); // TODO: can be stored in localStorage
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

    onFilterSearchChange(searchValues: string){
        this.filtering = true;
        if (!this.commonService.isEmptyString(searchValues)){
            let filteredClients = searchValues.split(",");
            console.log("filtering", filteredClients);

            this.displayedJobs = this.jobs.filter(function (proj) {
                if (proj.client) {
                    return filteredClients.indexOf(proj.client.toLowerCase()) != -1;
                }
                return false;
            });
        } else {
            // display all if filter is not working
            this.displayedJobs = this.jobs;
        }
        this.filtering = false;
    }
}
