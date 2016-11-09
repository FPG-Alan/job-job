import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Client} from "../../classes/client";

@Component({
    selector: 'app-new-client',
    templateUrl: './new-client.component.html',
    styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {

    client: Client;
    submitted = false;
    currentBrand: string = "";

    constructor() {
    }

    ngOnInit() {
        this.resetClientModel();
    }

    addBrand() {
        this.client.brands.push(this.currentBrand);
        this.currentBrand = "";
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
        }
    }

    resetClientModel() {
        this.client = new Client("", "", "", 0, [])
    }
}
