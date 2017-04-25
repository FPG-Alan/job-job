import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import {
    Router,
    NavigationStart,
    NavigationEnd,
    ActivatedRoute,
    NavigationCancel,
    NavigationError
} from "@angular/router";
import {Component, ViewChild} from "@angular/core";
import {AuthService} from "./services/auth.service";
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {BreadcrumbComponent} from "./components/breadcrumb/breadcrumb.component";
import {Title} from "@angular/platform-browser";

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
                private titleService: Title,
                private slimLoadingBarService: SlimLoadingBarService) {
        // we only start displaying the progress bar after some async action was started by the router
        this.router.events
            .filter(event => event instanceof NavigationStart)
            .subscribe(() => {
                if (this.authService.authenticated()) this.startLoading()
            }); // show the progress bar
        this.router.events
            .filter(event => (event instanceof NavigationCancel || event instanceof NavigationError))
            .subscribe(() => this.resetLoading()); // cancel progress bar
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => {
                // hide the progress bar
                this.completeLoading();

                if (this.authService.authenticated()) {
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
                event['title'] + " | Job Job")); // Dynamic Page Titles - Code by Todd Motto


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


    /********************
     * SLIM LOADING BAR *
     ********************/
    startLoading() {
        this.slimLoadingBarService.start(() => {
            console.log('Loading complete');
        });
        this.slimLoadingBarService.progress = 50;
    }

    stopLoading() {
        this.slimLoadingBarService.stop();
    }

    completeLoading() {
        this.slimLoadingBarService.complete();
    }

    resetLoading() {
        this.slimLoadingBarService.reset();
    }
}
