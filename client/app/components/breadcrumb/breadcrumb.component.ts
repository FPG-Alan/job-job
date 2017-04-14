/**
 * Breadcrumb Using Router - Code by Brian Love
 */

import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, PRIMARY_OUTLET} from "@angular/router";

interface Breadcrumb {
    label: string;
    params?: Params;
    url: string;
}

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

    breadcrumbs = [];

    constructor() {
    }

    ngOnInit() {
    }

    public getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
        // custom data property
        const ROUTE_DATA_BREADCRUMB: string = "title";

        // get the child routes
        let children: ActivatedRoute[] = route.children;

        // return if there are no more children
        if (children.length === 0) {
            return breadcrumbs;
        }

        // iterate over each children
        for (let child of children) {
            // verify primary route
            if (child.outlet !== PRIMARY_OUTLET) {
                continue;
            }

            // verify the custom data property e.g. "breadcrumb" or "title" is specified on the route
            if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
                return this.getBreadcrumbs(child, url, breadcrumbs);
            }

            // get the route's URL segment
            let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");
            if (routeURL == ""){
                continue
            }

            //append route URL to URL
            url += `/${routeURL}`;

            // add breadcrumb
            let breadcrumb: Breadcrumb = {
                label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
                params: child.snapshot.params,
                url: url
            };
            breadcrumbs.push(breadcrumb);

            // recursive
            return this.getBreadcrumbs(child, url, breadcrumbs);
        }

        return breadcrumbs;
    }
}
