import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {ApiService} from "../../../services/api.service";
import {CommonService} from "../../../services/common.service";

declare var $;

@Component({
    selector: 'app-box-template-selector',
    templateUrl: './box-template-selector.component.html',
    styleUrls: ['./box-template-selector.component.scss']
})
export class BoxTemplateSelectorComponent implements OnInit {


    @Output() onTemplateRetrieveFailed = new EventEmitter<boolean>();
    @Input() newJob: any = null;
    selectedTemplate: any = null;
    templateFolders: any[] = [];

    constructor(private apiService: ApiService,
                private commonService: CommonService) {
    }

    ngOnInit() {
        $(".ui.selection.dropdown").dropdown();
        this.apiService.getFolderTemplates()
            .subscribe(
                res => {
                    this.templateFolders = res;
                    if (this.templateFolders.length == 0) {
                        this.onTemplateRetrieveFailed.emit(true);
                    }
                },
                err=> {
                    this.commonService.handleError({
                        header: "Failed to retrieve Box folder templates",
                        message: "Please click the refresh button (if applicable) " +
                        "or manually reload this page"
                    });
                    this.onTemplateRetrieveFailed.emit(true);
                }
            );
    }

    onFolderChanged(){

    }

    copyFolder(){

    }
}
