package com.hmach.codiseum.dto.messages;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class EndGameMessage {
    private String type = "gameEnd";
    private String reason;
    private boolean completed;
    private int points;
    private int opponentPoints;

    public EndGameMessage(String reason) {
        this.reason = reason;
    }
}
