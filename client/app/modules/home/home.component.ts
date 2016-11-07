import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

    activeMenuTab = "jobs";

    constructor() {
    }

    ngOnInit() {
    }

    onJobCreateSuccess(e: any){
        // TODO: refresh job list
    }
}
