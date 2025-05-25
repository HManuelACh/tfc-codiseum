package com.hmach.codiseum.dto.messages;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BattleRequestMessage {
    private String type = "battleRequest";
    private String opponentUsername;

    public BattleRequestMessage(String opponentUsername) {
        this.opponentUsername = opponentUsername;
    }
}
