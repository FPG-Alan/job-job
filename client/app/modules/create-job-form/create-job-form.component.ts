import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Job} from "../../classes/job";
import {TenKFtService} from "../../services/ten-k-ft.service";

@Component({
    selector: 'app-create-job-form',
    templateUrl: './create-job-form.component.html',
    styleUrls: ['./create-job-form.component.scss']
})
export class CreateJobFormComponent implements OnInit {

    job = new Job("", null, "", null, "", "", "", "", null, "", "", []);

    constructor(private tenKFtService: TenKFtService) {
    }

    ngOnInit() {
    }

    onSubmit(form: NgForm) {
        console.log(form.value);
        console.log(form.valid);
        // TODO: validation and set to untouched/clean to avoid spamming
        this.tenKFtService.createNewJob(this.job)
            .subscribe(res => console.log(res))
    }
}
