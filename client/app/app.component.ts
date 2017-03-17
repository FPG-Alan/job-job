import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Component} from "@angular/core";
import {AuthService} from "./services/auth.service";
import {Router, NavigationEnd, ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";

declare var $;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    title = 'app works!';

    constructor(private authService: AuthService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private titleService: Title) {
        // Dynamic Page Titles - Code by Todd Motto
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map(route => {
                while (route.firstChild) route = route.firstChild;
                return route;
            })
            .filter(route => route.outlet === 'primary')
            .mergeMap(route => route.data)
            .subscribe((event) => this.titleService.setTitle(
                event['title'] + " | Job Job"));

        $('#notif-message .close')
            .on('click', function () {
                $(this).closest('.message').transition('fade');
            });
        $('.ui.dropdown').dropdown();
        $('.ui.modal').modal();
    }

    toggleSidebar() {
        $(".ui.sidebar")
            .sidebar({ context: $('app-root') })
            .sidebar('setting', 'transition', 'overlay')
            .sidebar("toggle");
    }
}
