import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from "@angular/core";
import {ApiService} from "../../../services/api.service";
import {CommonService} from "../../../services/common.service";

declare var $;

@Component({
    selector: 'app-box-template-selector',
    templateUrl: './box-template-selector.component.html',
    styleUrls: ['./box-template-selector.component.scss']
})
export class BoxTemplateSelectorComponent implements OnInit, OnDestroy {


    @Output() onTemplateRetrieveFailed = new EventEmitter<boolean>();
    @Output() onTemplateCopied = new EventEmitter<string>();
    @Output() onTemplateCopyFailed = new EventEmitter<boolean>();
    @Input() userId: string = "";
    @Input() userRole: string = "";
    newFolder: any = null;
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
                },
                err => {
                    this.commonService.handleError({
                        header: "Failed to retrieve Box folder templates",
                        message: "Please click the refresh button (if applicable) " +
                        "or manually reload this page"
                    });
                    this.onTemplateRetrieveFailed.emit(true);
                }
            );
    }


    ngOnDestroy() {
        // avoid duplicate modals
        $("#new-box-template-modal").modal("hide");
        $("#new-box-template-modal").remove();
    }

    openModal() {
        $("#new-box-template-modal")
            .modal("setting", "closable", false)
            .modal("show");
    }

    addNewTemplate(templateId, templateName) {
        if (!this.commonService.isEmptyString(templateId)
            && !this.commonService.isEmptyString(templateName)) {
            this.apiService
                .createNewFolderTemplate(templateId, templateName)
                .subscribe(
                    res => {
                        console.log(res);
                        this.templateFolders.push(res);
                        this.selectedTemplate = res;
                        $("#box-template-select-field div.text")[0].innerText = res.name;
                        this.commonService.notifyMessage(
                            "success",
                            "Sweet!",
                            "Added a new Box template: "
                            + "\"" + this.selectedTemplate.name + "\""
                        );
                        $("#new-box-template-modal").modal("hide");
                    },
                    err => this.commonService.handleError(err)
                )
        } else {
            $("#new-box-template-modal").modal("hide");
        }
    }

    copyFolder() {
        if (this.newFolder && this.selectedTemplate) {
            this.apiService
                .copyFolders(this.userId, this.selectedTemplate.id, this.newFolder.id)
                .subscribe(
                    res => this.onTemplateCopied.emit("completed"),
                    err => this.onTemplateCopyFailed.emit(err)
                )
        }
    }
}

