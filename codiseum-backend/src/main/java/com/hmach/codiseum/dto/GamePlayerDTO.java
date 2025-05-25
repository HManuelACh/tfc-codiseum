package com.hmach.codiseum.dto;

import java.util.HashSet;
import java.util.Set;

import org.springframework.web.socket.WebSocketSession;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class GamePlayerDTO {

    private WebSocketSession session;
    private GameDTO currentGame;
    private Set<String> battleRequest = new HashSet<>();

    public GamePlayerDTO(WebSocketSession session) {
        this.session = session;
    }

}
