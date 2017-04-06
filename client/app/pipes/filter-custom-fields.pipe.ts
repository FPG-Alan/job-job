/**
 * Author: Ankit Singh @solodynamo
 * Source: https://github.com/solodynamo/ng2-search-filter
 * Description: Angular 2 filter to make custom search
 */

import {Pipe, PipeTransform, Injectable} from "@angular/core";


@Pipe({
    name: 'filterCustomFields',
    pure: false
})
@Injectable()
export class SearchCustomFieldsPipe implements PipeTransform {

    /**
     * Accept the list to search from and the keyword
     *
     * @param items - The array of items we're searching from
     * @param attr - The type of attribute we need to search
     * @param term - The keyword you would want to compare
     * @param exact - Whether user wants to search for the exact words
     * @returns {any}
     */
    transform(items: any, keyword: string, attrId: number, exact: boolean): any {
        if (!keyword || /^\s*$/.test(keyword)) {
            return items;
        }

        return items.filter(function (item) {
            // validate existence
            if (!item.custom_field_values || !item.custom_field_values.data || !keyword) {
                return false
            }
            for (let values of item.custom_field_values.data) {
                if (values.custom_field_id == attrId && values.value) {
                    // match exact words or not
                    // don't return false if not found, move on to the next one
                    if (exact) {
                        if (values.value.toLowerCase() == keyword.toLowerCase()) return true;
                    } else {
                        if (values.value.toLowerCase().includes(keyword.toLowerCase())) return true;
                    }
                }
            }
            return false
        });
    }
}