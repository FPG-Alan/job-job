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
    loading: boolean = false;
    sortOrder: string = "";
    sortCategory: string = "";

    constructor(private apiService: ApiService,
                private commonService: CommonService) {
    }

    ngOnInit() {
        $(".ui.multiple.selection.dropdown").dropdown();

        this.loading = true;
        this.apiService.getAllJobs()
            .subscribe(
                result => {
                    this.jobs = result.data;
                    this.onFilterSearchChange(""); // TODO: can be stored in localStorage
                    this.sortTable("name");
                    console.log(this.jobs);
                },
                err => this.commonService.handleError(err),
                () => this.loading = false
            );
        this.apiService.getAllClients()
            .subscribe(
                result => this.clients = result,
                err => this.commonService.handleError(err)
            );
    }

    onFilterSearchChange(searchValues: string) {
        this.loading = true;
        if (!this.commonService.isEmptyString(searchValues)) {
            let filteredClients = searchValues.split(",");
            console.log("loading", filteredClients);

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
        this.loading = false;
    }

    sortTable(category: string) {
        if (this.sortCategory != category) {
            // ascending order if not sorted
            this.sortOrder = "descending";
            this.sortCategory = category;
        } else {
            // toggle if already sorted
            if (this.sortOrder == "descending") {
                this.sortOrder = "ascending";
            } else if (this.sortOrder == "ascending") {
                this.sortOrder = "descending"
            }
        }

        // only sort if the list hasn't been sorted yet
        // the default is descending, so just reverse the list to ascending
        if (this.sortOrder == "descending") {
            this.displayedJobs.sort((a: any, b: any) => {
                if (this.sortCategory == "name") {
                    return this.compareStrings(a.name, b.name);
                } else if (this.sortCategory == "client") {
                    let result = this.compareStrings(a.client, b.client);
                    // more consistency; compare with names if no client exists
                    return result == 0 ? this.compareStrings(a.name, b.name) : result;
                }
            });
        } else if (this.sortOrder == "ascending") {
            this.displayedJobs = this.displayedJobs.reverse();
        }
    }

    compareStrings(a: string, b: string) {
        if (!a) a = "";
        if (!b) b = "";
        // compare to see if the 1st string is larger than the 2nd
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }
}
