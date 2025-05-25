package com.hmach.codiseum.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.hmach.codiseum.dto.ChallengeDTOFull;
import com.hmach.codiseum.service.ChallengeService;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<List<ChallengeDTOFull>> getAllChallenges() {
        List<ChallengeDTOFull> challenges = challengeService.getAllChallenges();
        return ResponseEntity.ok(challenges);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ChallengeDTOFull> getChallengeById(@PathVariable Long id) {
        ChallengeDTOFull challenge = challengeService.getChallengeById(id);
        return ResponseEntity.ok(challenge);
    }

    @PostMapping(value = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChallengeDTOFull> createChallenge(
            @RequestParam("name") String name,
            @RequestParam("duration") Integer duration,
            @RequestParam("solution") String solution,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {

        ChallengeDTOFull challengeDto = new ChallengeDTOFull();
        challengeDto.setName(name);
        challengeDto.setDuration(duration);
        challengeDto.setSolution(solution);

        ChallengeDTOFull created = challengeService.createChallenge(challengeDto, imageFile);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChallengeDTOFull> updateChallenge(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("duration") Integer duration,
            @RequestParam("solution") String solution,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {

        ChallengeDTOFull challengeDto = new ChallengeDTOFull();
        challengeDto.setName(name);
        challengeDto.setDuration(duration);
        challengeDto.setSolution(solution);

        ChallengeDTOFull updated = challengeService.updateChallenge(id, challengeDto, imageFile);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(@PathVariable Long id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/image/{id}")
    public ResponseEntity<Resource> getChallengeImage(@PathVariable Long id) {
        Resource image = challengeService.getChallengeImageById(id);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(image);
    }
}