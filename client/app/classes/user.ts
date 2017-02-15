export class User {
    constructor(public userId: string,
                public name: string,
                public email: string,
                public boxAuthenticated: Boolean,
                public trelloAuthenticated: Boolean,
                public slackAuthenticated: Boolean) {
    }
}
