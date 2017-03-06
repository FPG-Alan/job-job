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
     * @param items
     * @param term
     * @returns {any}
     */
    transform(items: any, term: any): any {
        if (!term || /^\s*$/.test(term)){
            return items;
        }

        return items.filter(function (item) {
            return item.name.toLowerCase().includes(term.toLowerCase());
        });
    }
}