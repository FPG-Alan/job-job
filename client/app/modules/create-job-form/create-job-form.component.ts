import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Job} from "../../classes/job";

@Component({
    selector: 'app-create-job-form',
    templateUrl: './create-job-form.component.html',
    styleUrls: ['./create-job-form.component.scss']
})
export class CreateJobFormComponent implements OnInit {

    job = new Job("", null, "", null, "", "", "", "", null, "", "", []);

    constructor() {
    }

    ngOnInit() {
    }

    onSubmit(form: NgForm) {
        console.log(form.value);
        console.log(form.valid)
    }
}
