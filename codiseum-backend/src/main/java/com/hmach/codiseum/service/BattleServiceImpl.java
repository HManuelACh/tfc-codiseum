package com.hmach.codiseum.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.hmach.codiseum.dto.BattleDTO;
import com.hmach.codiseum.dto.GameDTO;
import com.hmach.codiseum.exception.NotFoundException;
import com.hmach.codiseum.mapper.BattleMapper;
import com.hmach.codiseum.model.Battle;
import com.hmach.codiseum.model.User;
import com.hmach.codiseum.repository.BattleRepository;

import java.util.List;

@Service
public class BattleServiceImpl implements BattleService {

    @Autowired
    private BattleRepository battleRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private BattleMapper battleMapper;

    @Override
    public List<BattleDTO> getAllBattles() {
        List<Battle> battles = battleRepository.findAll();
        return battleMapper.toDto(battles);
    }
    
    @Override
    public BattleDTO getBattleById(Long id) {
        Battle battle = battleRepository.findById(id).orElseThrow(() -> new NotFoundException("Batalla no encontrada"));
        return battleMapper.toDto(battle);
    }

    @Override
    public List<BattleDTO> getBattlesByUserId(Long userId) {
        List<Battle> battles = battleRepository.findByPlayer1IdOrPlayer2Id(userId, userId);
        return battleMapper.toDto(battles);
    }

    @Override
    public void registerBattle(GameDTO game) {
        User user1 = userService.getUserByGoogleId((String) game.getPlayer1().getSession().getAttributes().get("googleId"));
        User user2 = userService.getUserByGoogleId((String) game.getPlayer2().getSession().getAttributes().get("googleId"));
        User winner = null;

        if (game.getPlayer1().equals(game.getWinner())) {
            winner = user1;
        } else if (game.getPlayer2().equals(game.getWinner())) {
            winner = user2;
        }

        Battle battle = new Battle(null, user1, user2, winner, game.getChallenge(), game.getPlayer1Solution(), game.getPlayer2Solution(), game.getPlayer1Points(), game.getPlayer2Points());
        battleRepository.save(battle);
    }

}
