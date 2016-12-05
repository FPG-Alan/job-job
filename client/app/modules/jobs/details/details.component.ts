import {Component, OnInit, ViewChild} from "@angular/core";
import {Params, ActivatedRoute} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {CommonService} from "../../../services/common.service";
import {RateCardSelectorComponent} from "../rate-card-selector/rate-card-selector.component";

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

    @ViewChild('rateCardSelector')
    private rateCardSelectorComponent: RateCardSelectorComponent;
    job: any;
    selectingRateCard: boolean = false;
    rateCardProcessingState = "disabled";


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

    onRateUpdated(state: any) {
        this.selectingRateCard = false;
        this.rateCardProcessingState = "disabled"
        if (state == "completed") {
            this.commonService.notifyMessage(
                "success",
                "Sweet!",
                "Copied over bill rates template"
            )
        } else {
            this.commonService.notifyMessage(
                "error",
                "Couldn't copy bill rates",
                "Please check your project in 10,000ft"
            )
        }
    }
}
