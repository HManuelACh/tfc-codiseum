package com.hmach.codiseum.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import com.hmach.codiseum.dto.BattleDTO;
import com.hmach.codiseum.model.Battle;

@Mapper(componentModel = "spring")
public interface BattleMapper {
    
    @Mappings({
        @Mapping(source = "player1.id", target = "player1Id"),
        @Mapping(source = "player1.username", target = "player1Username"),

        @Mapping(source = "player2.id", target = "player2Id"),
        @Mapping(source = "player2.username", target = "player2Username"),

        @Mapping(source = "winner.id", target = "winnerId"),

        @Mapping(source = "challenge.id", target = "challengeId"),
        @Mapping(source = "challenge.name", target = "challengeName")
    })
    BattleDTO toDto(Battle battle);
    List<BattleDTO> toDto(List<Battle> battles);

}
