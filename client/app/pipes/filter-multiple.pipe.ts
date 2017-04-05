/**
 * Author: Ankit Singh @solodynamo
 * Source: https://github.com/solodynamo/ng2-search-filter
 * Description: Angular 2 filter to make custom search
 */

import {Pipe, PipeTransform, Injectable} from "@angular/core";


@Pipe({
    name: 'filterMultiple',
    pure: false
})
@Injectable()
export class SearchMultiplePipe implements PipeTransform {

    /**
     * Accept the list to search from and the list of keywords to search for
     *
     * @param items - The array of items we're searching from
     * @param attr - The type of attribute we need to search
     * @param list - The list of keywords you would want to compare
     * @param exact - Whether user wants to search for the exact words
     * @returns {any}
     */
    transform(items: any, list: string[], attr: string, exact: boolean): any {
        if (!list || list.length == 0) {
            return items;
        }

        return items.filter(function (item) {
            for (let keyword of list) {
                // validate existence
                if (!item[attr]) continue;
                // match exact words or not
                if (exact) {
                    if (item[attr].toLowerCase() == keyword.toLowerCase()) return true;
                } else {
                    if (item[attr].toLowerCase().includes(keyword.toLowerCase())) return true;
                }
            }
            return false;
        });
    }
}