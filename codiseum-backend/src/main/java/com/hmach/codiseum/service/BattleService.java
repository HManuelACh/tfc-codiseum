package com.hmach.codiseum.service;

import com.hmach.codiseum.dto.BattleDTO;
import com.hmach.codiseum.dto.GameDTO;

import java.util.List;
            
public interface BattleService {

    List<BattleDTO> getAllBattles();
    BattleDTO getBattleById(Long id);
    List<BattleDTO> getBattlesByUserId(Long userId);

    void registerBattle(GameDTO game);

}
