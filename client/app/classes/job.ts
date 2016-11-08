import {Client} from "./client";
import {Phase} from "./phase";

export class Job {
    constructor(public name: string,
                public client: Client,
                public brand: string,
                public jobNumber: number,
                public status: string,
                public rateCard: string,
                public serviceType: string,
                public description: string,
                public tags: any[],
                public startDate: string | Date,
                public endDate: string | Date,
                public phases: Phase[]) {
    }
}
