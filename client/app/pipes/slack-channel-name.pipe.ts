import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'slackChannelName'
})
export class SlackChannelNamePipe implements PipeTransform {

    transform(value: string): string {
        if (!value ) {
            return ""
        }
        // ~21 characters, only a-z, 0-9, hyphens, underscores
        let result = 'p-' + value;
        result = result.replace(/\_/g, '-');

        // the prefix that needs to be included in a project channel name
        if (!result.match(/^([^-]*\-){2}/)) return 'p-' + value.toLowerCase();
        let requiredPrefix:string = result.match(/^([^-]*\-){2}/)[0];
        let remainLength = 22 - requiredPrefix.length;

        // the remaining substring that might need to be reduced
        let variedName = result.replace(/^(?:[^-]*\-){2}([^]*)/gi, '$1');
        variedName = variedName.replace(/(?!^[aioeu])[aioue]/gi, '');
        variedName = variedName.slice(0, remainLength);

        result = requiredPrefix + variedName;
        return result.toLowerCase();
    }
}
