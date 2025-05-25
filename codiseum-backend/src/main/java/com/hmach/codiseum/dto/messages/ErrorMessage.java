package com.hmach.codiseum.dto.messages;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ErrorMessage {
    private String type = "error";
    private String reason;
    private String message;

    public ErrorMessage(String reason, String message) {
        this.reason = reason;
        this.message = message;
    }
}