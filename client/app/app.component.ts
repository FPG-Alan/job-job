import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {Component, ViewChild} from "@angular/core";
import {AuthService} from "./services/auth.service";
import {Router, NavigationEnd, ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {BreadcrumbComponent} from "./components/breadcrumb/breadcrumb.component";

declare var $;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    @ViewChild('breadcrumb')
    private breadcrumbComponent: BreadcrumbComponent;

    constructor(private authService: AuthService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private titleService: Title) {
        // Dynamic Page Titles - Code by Todd Motto
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => {
                if (this.authService.authenticated()) {
                    // set breadcrumbs
                    let root: ActivatedRoute = this.activatedRoute.root;
                    this.breadcrumbComponent.breadcrumbs =
                        this.breadcrumbComponent.getBreadcrumbs(root, "", []);
                }
                return this.activatedRoute;
            })
            .map(route => {
                while (route.firstChild) route = route.firstChild;
                return route;
            })
            .filter(route => route.outlet === 'primary')
            .mergeMap(route => route.data)
            .subscribe((event) => this.titleService.setTitle(
                event['title'] + " | Job Job"));

        // Semantic UI Modules
        $('.ui.dropdown').dropdown();
        $('.ui.modal').modal();

        // NotifyJs Settings
        $.notify.addStyle('custom', {
            html: `
                <div>
                    <div class="ui message"">
                        <div class="header" data-notify-html="header"></div>
                        <p class="content" data-notify-html="content"></p>
                    </div>
                </div>`
        });
    }

    toggleSidebar() {
        $(".ui.sidebar")
            .sidebar({context: $('app-root')})
            .sidebar('setting', 'transition', 'overlay')
            .sidebar("toggle");
    }
}
