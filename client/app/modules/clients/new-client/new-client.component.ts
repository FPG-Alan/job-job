import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {Client} from "../../../classes/client";
import {CommonService} from "../../../services/common.service";
import {ApiService} from "../../../services/api.service";

declare var $;

@Component({
    selector: 'app-new-client',
    templateUrl: 'new-client.component.html',
    styleUrls: ['new-client.component.scss']
})
export class NewClientComponent implements OnInit {

    submitted = false;
    client: Client;
    currentBrand: string = "";

    constructor(private router: Router,
                private commonService: CommonService,
                private apiService: ApiService) {
    }

    ngOnInit() {
        this.resetModels();
    }

    addBrand() {
        if (!this.commonService.isEmptyString(this.currentBrand)) {
            this.client.brands.push(this.currentBrand.trim());
            this.currentBrand = "";
        }
    }

    removeBrand(index: number) {
        if (index > -1) {
            this.client.brands.splice(index, 1);
        }
    }

    onSubmit(form: NgForm) {
        console.log(form.value);
        console.log(form.valid);
        console.log(form);

        if (form.valid && !this.submitted) {
            this.submitted = true;
            this.apiService.createNewClient(this.client)
                .subscribe(
                    res => {
                        console.log(res);
                        this.resetModels();
                        this.commonService.notifyMessage(
                            "success",
                            "Sweet!",
                            "Successfully created a new client"
                        );
                        this.router.navigate(["/"]);
                    },
                    err => this.commonService.handleError(err)
                );
        }
    }

    resetModels() {
        this.client = new Client("", "", "", []);
    }
}
