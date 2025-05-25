package com.hmach.codiseum.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.hmach.codiseum.dto.ChallengeDTOFull;
import com.hmach.codiseum.model.Challenge;

@Mapper(componentModel = "spring")
public interface ChallengeMapper {
    ChallengeDTOFull toDto(Challenge challenge);
    Challenge toEntity(ChallengeDTOFull challenge);

    List<ChallengeDTOFull> toDto(List<Challenge> challenges);
}
