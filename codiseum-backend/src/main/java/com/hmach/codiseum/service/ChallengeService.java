package com.hmach.codiseum.service;

import com.hmach.codiseum.dto.ChallengeDTOFull;
import com.hmach.codiseum.model.Challenge;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ChallengeService {

    List<ChallengeDTOFull> getAllChallenges();
    ChallengeDTOFull getChallengeById(Long id);
    ChallengeDTOFull createChallenge(ChallengeDTOFull challengeDto, MultipartFile imageFile);
    ChallengeDTOFull updateChallenge(Long id, ChallengeDTOFull challengeDto, MultipartFile imageFile);
    void deleteChallenge(Long id);
    
    Resource getChallengeImageById(Long id);
    Challenge getRandomChallenge();
}
