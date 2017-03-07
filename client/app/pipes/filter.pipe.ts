/**
 * Author: Ankit Singh @solodynamo
 * Source: https://github.com/solodynamo/ng2-search-filter
 * Description: Angular 2 filter to make custom search
 */

import {Pipe, PipeTransform, Injectable} from "@angular/core";


@Pipe({
    name: 'filter',
    pure: false
})
@Injectable()
export class SearchPipe implements PipeTransform {

    /**
     * Accept the list to search from and the keyword
     *
     * @param items - The array of items we're searching from
     * @param attr - The type of attribute we need to search
     * @param term - The keyword you would want to compare
     * @param exact - Whether user wants to search for the exact words
     * @returns {any}
     */
    transform(items: any, keyword: any, attr: string, exact: boolean): any {
        if (!keyword || /^\s*$/.test(keyword)) {
            return items;
        }

        return items.filter(function (item) {
            // validate existence
            if (!item[attr] || !keyword) {
                return false
            }
            // match exact words or not
            if (exact) {
                return item[attr].toLowerCase() == keyword.toLowerCase();
            } else {
                return item[attr].toLowerCase().includes(keyword.toLowerCase());
            }
        });
    }
}