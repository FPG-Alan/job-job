import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'slackChannelName'
})
export class SlackChannelNamePipe implements PipeTransform {

    transform(value: string, variant: string): string {
        if (!value) {
            return ""
        }
        // ~21 characters, only a-z, 0-9, hyphens, underscores
        let result = 'p-' + value;
        result = result.replace(/\_/g, '-');

        // the prefix that needs to be included in a project channel name
        if (!result.match(/^([^-]*\-){2}/)) return 'p-' + value.toLowerCase();
        let requiredPrefix: string = result.match(/^([^-]*\-){2}/)[0];
        let remainLength = 21 - requiredPrefix.length;

        // the remaining substring that might need to be reduced
        let variedName = result.replace(/^(?:[^-]*\-){2}([^]*)/gi, '$1');
        if (variant == "noVowels") {
            variedName = variedName
                .replace(/(?!^[aioeu])[aioue]/gi, '')
                .slice(0, remainLength);
        } else if (variant == "abruptCut") {
            variedName = variedName.slice(0, remainLength);
        }

        // strip tailing dash
        if (variedName.substr(-1) == "-") {
            variedName = variedName.substring(0, variedName.length - 1)
        }

        result = requiredPrefix + variedName;
        return result.toLowerCase();
    }
}
