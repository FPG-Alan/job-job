import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from "@angular/core";
import {ApiService} from "../../../services/api.service";
import {CommonService} from "../../../services/common.service";

declare var $;

@Component({
    selector: 'app-trello-template-selector',
    templateUrl: 'trello-template-selector.component.html',
    styleUrls: ['trello-template-selector.component.scss']
})
export class TrelloTemplateSelectorComponent implements OnInit, OnDestroy {

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
                        header: "Failed to retrieve Trello board templates",
                        message: "Please click the refresh button (if applicable) " +
                        "or manually reload this page"
                    });
                    this.onTemplateRetrieveFailed.emit(true);
                }
            );
    }


    ngOnDestroy() {
        // avoid duplicate modals
        $("#new-trello-template-modal").modal("hide");
        $("#new-trello-template-modal").remove();
    }

    openModal() {
        $("#new-trello-template-modal")
            .modal("setting", "closable", false)
            .modal("show");
    }

    addNewTemplate(templateId, templateName) {
        if (!this.commonService.isEmptyString(templateId)
            && !this.commonService.isEmptyString(templateName)) {
            this.apiService
                .createNewBoardTemplate(templateId, templateName)
                .subscribe(
                    res => {
                        console.log(res);
                        this.templateFolders.push(res);
                        this.selectedTemplate = res;
                        $("#trello-template-select-field div.text")[0].innerText = res.name;
                        this.commonService.notifyMessage(
                            "success",
                            "Sweet!",
                            "Added a new Trello template: "
                            + "\"" + this.selectedTemplate.name + "\""
                        );
                        $("#new-trello-template-modal").modal("hide");
                    },
                    err => this.commonService.handleError(err)
                )
        } else {
            $("#new-trello-template-modal").modal("hide");
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

