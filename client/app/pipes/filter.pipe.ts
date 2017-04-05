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
    transform(items: any, keyword: string, attr: string, exact: boolean): any {
        if (!keyword || /^\s*$/.test(keyword)) {
            return items;
        }

        return items.filter(function (item) {
            // validate existence
            if (!item[attr] || !keyword) {
                return false
            }
            // users might use spaces in their search
            let spacedKeyword = keyword.trim().split(/\s+/);
            for (let k of spacedKeyword) {
                // match exact words or not
                if (exact) {
                    return item[attr].toLowerCase() == k.toLowerCase();
                } else {
                    // don't return false if not found, move on to the next one
                    if (item[attr].toLowerCase().includes(k.toLowerCase())) {
                        return true
                    }
                }
            }
            return false
        });
    }
}