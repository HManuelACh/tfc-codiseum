package com.hmach.codiseum.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hmach.codiseum.dto.ChallengeDTOFull;
import com.hmach.codiseum.exception.NotFoundException;
import com.hmach.codiseum.mapper.ChallengeMapper;
import com.hmach.codiseum.model.Challenge;
import com.hmach.codiseum.repository.ChallengeRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class ChallengeServiceImpl implements ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private ChallengeMapper challengeMapper;

    @Override
    public List<ChallengeDTOFull> getAllChallenges() {
        List<Challenge> challenges = challengeRepository.findAll();
        return challengeMapper.toDto(challenges);
    }

    @Override
    public ChallengeDTOFull getChallengeById(Long id) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Desafío no encontrado"));
        return challengeMapper.toDto(challenge);
    }

    @Override
    public ChallengeDTOFull createChallenge(ChallengeDTOFull challengeDto, MultipartFile imageFile) {
        Challenge challenge = challengeMapper.toEntity(challengeDto);
        Challenge newChallenge = challengeRepository.save(challenge);

        if (imageFile != null && !imageFile.isEmpty()) {
            saveImageFile(newChallenge.getId(), imageFile);
        }

        return challengeMapper.toDto(newChallenge);
    }

    @Override
    public ChallengeDTOFull updateChallenge(Long id, ChallengeDTOFull challengeDto, MultipartFile imageFile) {
        Challenge existing = challengeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reto no encontrado"));

        existing.setName(challengeDto.getName());
        existing.setDuration(challengeDto.getDuration());
        existing.setSolution(challengeDto.getSolution());
        existing.setAllowedTags(challengeDto.getAllowedTags());

        Challenge updated = challengeRepository.save(existing);

        if (imageFile != null && !imageFile.isEmpty()) {
            saveImageFile(id, imageFile);
        }

        return challengeMapper.toDto(updated);
    }

    // Método privado para guardar la imagen
    private void saveImageFile(Long challengeId, MultipartFile imageFile) {
        try {
            Path uploadDir = Paths.get("uploads/images/challenges/");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            Path filePath = uploadDir.resolve(challengeId + ".png");
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        } catch (IOException e) {
            throw new RuntimeException("Error guardando imagen del desafío", e);
        }
    }

    @Override
    public void deleteChallenge(Long id) {
        if (!challengeRepository.existsById(id)) {
            throw new NotFoundException("Reto no encontrado");
        }

        try {
            Path imagePath = Paths.get("uploads/images/challenges/" + id + ".png").toAbsolutePath();
            Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Error al borrar la imagen del reto con id " + id, e);
        }

        challengeRepository.deleteById(id);
    }

    @Override
    public Resource getChallengeImageById(Long id) {
        if (!challengeRepository.existsById(id)) {
            throw new NotFoundException("Reto no encontrado");
        }

        Path imagePath = Paths.get("uploads/images/challenges/" + id + ".png").toAbsolutePath();
        Resource resource = new PathResource(imagePath);

        if (!resource.exists()) {
            throw new NotFoundException("Imagen no encontrada para el reto con id: " + id);
        }

        return resource;
    }

    @Override
    public Challenge getRandomChallenge() {
        Challenge randomChallenge = challengeRepository.getRandomChallenge();
        return randomChallenge;
    }
}