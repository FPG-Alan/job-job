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
    customFields: any;


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
                    console.log(job);
                },
                err => this.commonService.handleError(err)
            );
        this.getCustomFields();
    }

    onRateUpdated(state: any) {
        this.selectingRateCard = false;
        this.rateCardProcessingState = "disabled";
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

    getCustomFields() {
        this.apiService.getCustomFields()
            .subscribe(
                res => {
                    this.customFields = res.data;
                    this.route.params
                        .switchMap((params: Params) =>
                            this.apiService.getCustomFieldValues(+params['id']))
                        .subscribe(
                            res => this.fillCustomFieldValues(res.data),
                            err => this.commonService.handleError(err)
                        );
                },
                err => this.commonService.handleError(err)
            )
    }

    private fillCustomFieldValues(values: any[]) {
        console.log("values:", values);

        for (let field of this.customFields) {
            if (field.data_type == "string" || field.data_type == "selection_list") {
                field.vals = values.filter(function isSameFieldId(value){
                    return field.id == value.custom_field_id;
                });
            }
        }
        console.log("Custom fields:", this.customFields);
    }
}
