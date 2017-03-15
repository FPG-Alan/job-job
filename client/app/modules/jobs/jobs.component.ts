import {Component, OnInit} from "@angular/core";
import {Client} from "../../classes/client";
import {ApiService} from "../../services/api.service";
import {CommonService} from "../../services/common.service";
import {AuthService} from "../../services/auth.service";

declare var $;

@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

    jobs: any[] = [];
    displayedJobs: any[] = [];
    clients: Client[] = [];
    producers = [];
    loading: boolean = false;
    sortOrder: string = "";
    sortCategory: string = "";
    clientFilterInput = [];
    producerFilterInput = "";
    keywordFilterInput = "";


    constructor(private apiService: ApiService,
                private commonService: CommonService,
                private authService: AuthService) {
    }

    ngOnInit() {
        $(".ui.selection.dropdown").dropdown();

        this.authService.updateIntegrationStatus();

        this.loading = true;
        this.apiService.getAllJobs()
            .subscribe(
                result => {
                    this.jobs = result.data;
                    this.displayedJobs = this.jobs; // no filter
                    this.sortTable("name");
                },
                err => this.commonService.handleError(err),
                () => this.loading = false
            );
        this.apiService.getAllClients()
            .subscribe(
                result => this.clients = result,
                err => this.commonService.handleError(err)
            );
        // this.getProducers();
    }


    // getProducers() {
    //     if (this.producers.length == 0) {
    //         this.apiService.getCustomFields()
    //             .subscribe(
    //                 res => {
    //                     for (let field of res.data) {
    //                         if (field.name == "Producer") {
    //                             this.producers = field.options;
    //                             break;
    //                         }
    //                     }
    //                 },
    //                 err => this.commonService.handleError(err)
    //             )
    //     }
    // }


    /********
     * SORT *
     ********/
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
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }
}
