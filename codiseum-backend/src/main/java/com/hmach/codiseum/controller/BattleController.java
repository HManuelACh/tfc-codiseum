package com.hmach.codiseum.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.hmach.codiseum.dto.BattleDTO;
import com.hmach.codiseum.service.BattleService;

import java.util.List;

@RestController
@RequestMapping("/api/battles")
public class BattleController {

    @Autowired
    private BattleService battleService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<List<BattleDTO>> getAllBattles() {
        List<BattleDTO> battles = battleService.getAllBattles();
        return ResponseEntity.ok().body(battles);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<BattleDTO> getBattleById(@PathVariable Long id) {
        BattleDTO battle = battleService.getBattleById(id);
        return ResponseEntity.ok().body(battle);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BattleDTO>> getBattleByUserId(@PathVariable Long userId) {
        List<BattleDTO> battles = battleService.getBattlesByUserId(userId);
        return ResponseEntity.ok().body(battles);
    }
}
