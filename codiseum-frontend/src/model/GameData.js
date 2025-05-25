export class GameData {
    #challengeId;
    #challengeName;
    #opponentUsername;
    #challengeDuration;
    #points;
    #opponentPoints;
    #completed = false;

    constructor(challengeId, challengeName, opponentUsername, challengeDuration, points = 0, opponentPoints = 0) {
        this.#opponentUsername = opponentUsername;
        this.#challengeName = challengeName;
        this.#challengeId = challengeId;
        this.#challengeDuration = challengeDuration;
        this.#points = points;
        this.#opponentPoints = opponentPoints;
    }

    get opponentUsername() {
        return this.#opponentUsername;
    }
    set opponentUsername(value) {
        this.#opponentUsername = value;
    }

    get challengeName() {
        return this.#challengeName;
    }
    set challengeName(value) {
        this.#challengeName = value;
    }

    get challengeId() {
        return this.#challengeId;
    }
    set challengeId(value) {
        this.#challengeId = value;
    }

    get challengeDuration() {
        return this.#challengeDuration;
    }
    set challengeDuration(value) {
        this.#challengeDuration = value;
    }

    get points() {
        return this.#points;
    }

    set points(value) {
        this.#points = value;
    }

    get opponentPoints() {
        return this.#opponentPoints;
    }
    
    set opponentPoints(value) {
        this.#opponentPoints = value;
    }

    get completed() {
        return this.#completed;
    }

    set completed(value) {
        this.#completed = value;
    }

    toJson() {
        return {
            opponentUsername: this.#opponentUsername,
            challengeName: this.#challengeName,
            challengeId: this.#challengeId,
            challengeDuration: this.#challengeDuration,
            points: this.#points,
            opponentPoints: this.#opponentPoints,
            completed: this.#completed
        };
    }
}