import {Client} from "./client";

export class Job {
    constructor(public name: string,
                public client: Client,
                public brand: string,
                public code: string,
                public status: string,
                public serviceType: string,
                public description: string,
                public producer: string,
                public startDate: string | Date,
                public endDate: string | Date) {
    }
}
