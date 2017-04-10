import {Component, OnInit} from "@angular/core";

declare var $;
declare var Typed;

@Component({
    selector: 'app-steve-bot',
    templateUrl: 'steve-bot.component.html',
    styleUrls: ['steve-bot.component.scss']
})
export class SteveBotComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    greet() {
        setTimeout(function () {
            $("#steve").transition('fly up')
                .transition("setting", "onShow", function () {
                    $("#steve-message").removeClass("hidden");
                    Typed.new("#steve-message", {
                        strings: ["Hello! Me name Jobes.\nSteve Jobes."],
                        typeSpeed: -5,
                        backSpeed: -30,
                        showCursor: false
                    });
                });
        }, 3000);
    }

    say(sentences: string[]) {
        Typed.new("#steve-message", {
            strings: sentences,
            typeSpeed: -5,
            backSpeed: -30,
            showCursor: false
        })
    }
}
