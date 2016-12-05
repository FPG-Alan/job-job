/* tslint:disable:no-unused-variable */
import {NewJobComponent} from "./new-job.component";

describe('NewJobComponent', () => {

    it("onJobNameChange should split string and capitalize", () => {
        function onJobNameChange(value: string) {
            let result = "";
            let words = value.split(" ");
            for (let w in words) {
                if (words.hasOwnProperty(w)) {
                    console.log("index: ", w);
                    words[w] = words[w].charAt(0).toUpperCase() + words[w].slice(1);
                    result += words[w];
                }
            }
            return result;
        }

        expect(onJobNameChange("What a Client name")).toBe("WhatAClientName");
    })
});
