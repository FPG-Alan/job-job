/* tslint:disable:no-unused-variable */
import {NewJobComponent} from "./new-job.component";

describe('NewJobComponent', () => {

    it("onJobNameChange should split string, add underscores, and capitalize", () => {
        function onJobNameChange(value: string) {
            let result = "";
            let words = value.split(" ");
            for (let w in words) {
                if (words.hasOwnProperty(w)) {
                    console.log("index: ", w);
                    if (w > 0) {
                        result += "_";
                    }
                    words[w] = words[w].charAt(0).toUpperCase();
                    result += words[w];
                }
            }
            return result;
        }

        expect(onJobNameChange("What a client name")).toBe("What_A_Client_Name");
    })
});
