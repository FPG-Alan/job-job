import {Component, OnInit, Output, EventEmitter} from "@angular/core";

declare var $;
declare var Typed;

@Component({
    selector: 'app-steve-bot',
    templateUrl: 'steve-bot.component.html',
    styleUrls: ['steve-bot.component.scss']
})
export class SteveBotComponent implements OnInit {

    @Output() onSteveStop = new EventEmitter<boolean>();
    steveAlreadySaid = {};

    constructor() {
    }

    ngOnInit() {
        $(".dropdown").dropdown({
            direction: "upward"
        });
        this.greet();
    }

    greet() {
        setTimeout(function () {
            $("#steve").transition('fly up')
                .transition("setting", "onShow", function () {
                    $("#steve-message").removeClass("hidden");
                    Typed.new("#steve-message", {
                        strings: ["Hello! Me name Jobes. Steve Jobes."],
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
            typeSpeed: -20,
            backSpeed: -30,
            showCursor: false
        })
    }

    sayOnce(sentences: string[], id: string) {
        if (!this.steveAlreadySaid[id]) {
            Typed.new("#steve-message", {
                strings: sentences,
                typeSpeed: -20,
                backSpeed: -30,
                showCursor: false
            });
            this.steveAlreadySaid[id] = true;
        }
    }

    stop() {
        Typed.new("#steve-message", {
            strings: ["K bai!"],
            typeSpeed: -5,
            backSpeed: -30,
            showCursor: false,
            callback: () => {
                $("#steve")
                    .transition('fly up')
                    .transition("setting", "onHide", () => {
                        this.onSteveStop.emit(false);
                    })
            }
        });
    }
}
