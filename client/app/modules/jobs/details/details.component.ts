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
    customFieldValues: any[] = [];
    fieldOrder = {
        "Brand": 1,
        "Producer": 2,
        "Rate Card": 3,
        "Type": 4,
        "Box Location": 5,
        "Trello Location": 6
    };
    rateCardFieldId: number = null;


    constructor(private apiService: ApiService,
                private commonService: CommonService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.apiService.getJobById(+params['id']))
            .subscribe(
                job => this.job = job,
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
            );
            this.customFieldValues.push({
                custom_field_id: this.rateCardFieldId,
                name: "Rate Card",
                value: this.rateCardSelectorComponent.selectedTemplate.name
            });
            this.createCustomFieldValues();
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
                    this.sortCustomFields();

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

    private sortCustomFields() {
        for (let field of this.customFields) {
            field.order = this.fieldOrder[field.name];
            if (!field.order) {
                field.order = 1000; // put fields with unlisted names last
            }
            if (field.name == "Rate Card") {
                this.rateCardFieldId = field.id;
            }
        }
        this.customFields.sort(function sortByCustomOrder(a, b) {
            return a.order - b.order
        });
    }

    private fillCustomFieldValues(values: any[]) {
        for (let field of this.customFields) {
            field.vals = values.filter(function isSameFieldId(value) {
                return field.id == value.custom_field_id;
            });
        }
    }

    private createCustomFieldValues() {
        this.apiService.createCustomFieldValues(
            this.job.id,
            this.customFieldValues)
            .subscribe(
                res => this.getCustomFields(),
                err => this.commonService.handleError(err)
            )
    }

    isUrl(text: string) {
        if (text) {
            text = text.trim();
            return text.indexOf("http") == 0;
        } else {
            return false;
        }
    }
}
