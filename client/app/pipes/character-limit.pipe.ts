import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'characterLimit'
})
export class CharacterLimitPipe implements PipeTransform {

    transform(value: string, limit: number): string {
        let result = value;
        result = result.length > limit
            ? value.slice(0, limit) + "..."
            : result;
        return result;
    }

}
