import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'slackChannelName'
})
export class SlackChannelNamePipe implements PipeTransform {

    transform(value: string): string {
        // ~21 characters, only a-z, 0-9, hyphens, underscores
        let result = 'p-' + value;
        result = result.replace(/\_/g, '-');

        // the prefix that needs to be included in a project channel name
        let requiredPrefix = result.match(/^([^-]*\-){2}/)[0];
        let remainLength = 21 - requiredPrefix.length;

        // the remaining substring that might need to be reduced
        let variedName = result.replace(/^(?:[^-]*\-){2}([^]*)/gi, '$1');
        variedName = variedName.replace(/(?!^[aioeu])[aioue]/gi, '');
        variedName = variedName.slice(0, remainLength);

        result = requiredPrefix + variedName;
        return result.toLowerCase();
    }
}
