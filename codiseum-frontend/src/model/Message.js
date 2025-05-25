class Message {
    #type;

    constructor(type) {
        this.#type = type;
    }

    get type() {
        return this.#type;
    }

    set type(value) {
        this.#type = value;
    }

    toJson() {
        return {
            type: this.#type
        };
    }
}

export class UserDataMessage extends Message {
    #username;

    constructor(username) {
        super("userData");
        this.#username = username;
    }

    get username() {
        return this.#username;
    }

    set username(value) {
        this.#username = value;
    }

    toJson() {
        return {
            type: this.type,
            username: this.#username
        };
    }
}

export class BattleRequestMessage extends Message {
    #opponentUsername;
    #accepted;

    constructor(opponentUsername, accepted = null) {
        super("battleRequest");
        this.#opponentUsername = opponentUsername;
        this.#accepted = accepted;
    }

    get opponentUsername() {
        return this.#opponentUsername;
    }

    set opponentUsername(value) {
        this.#opponentUsername = value;
    }

    get accepted() {
        return this.#accepted;
    }

    set accepted(value) {
        this.#accepted = value;
    }

    toJson() {
        return {
            type: this.type,
            opponentUsername: this.#opponentUsername, 
            accepted: this.#accepted
        };
    }
}

export class EnterQueueMessage extends Message {

    constructor() {
        super("enterQueue");
    }

    toJson() {
        return {
            type: this.type
        };
    }
}

export class QuitQueueMessage extends Message {

    constructor() {
        super("quitQueue");
    }

    toJson() {
        return {
            type: this.type
        };
    }
}

export class GameEndMessage extends Message {

    constructor() {
        super("gameEnd");
    }

    toJson() {
        return {
            type: this.type
        };
    }
}

export class SolutionMessage extends Message {

    #content;

    constructor(content) {
        super("solution");
        this.#content = content;
    }

    get content() {
        return this.#content;
    }

    set content(value) {
        this.#content = value;
    }

    toJson() {
        return {
            type: this.type, 
            content: this.#content
        };
    }
}