package com.hmach.codiseum.dto.messages;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class StartBattleMessage {
    private String type = "startBattle";
    private String opponentUsername;
    private Long challengeId;
    private String challengeName;
    private int challengeDuration;

    public StartBattleMessage(String opponentUsername, Long challengeId, String challengeName, int challengeDuration) {
        this.opponentUsername = opponentUsername;
        this.challengeId = challengeId;
        this.challengeName = challengeName;
        this.challengeDuration = challengeDuration;
    }
}
