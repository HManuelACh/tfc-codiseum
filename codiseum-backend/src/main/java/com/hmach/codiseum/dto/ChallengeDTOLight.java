package com.hmach.codiseum.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChallengeDTOLight {
    private Long id;
    private String name;
    private int duration;
    private String allowedTags;
}