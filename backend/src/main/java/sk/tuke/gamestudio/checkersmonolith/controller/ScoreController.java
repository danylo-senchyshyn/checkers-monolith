package sk.tuke.gamestudio.checkersmonolith.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.tuke.gamestudio.checkersmonolith.dto.score.ScoreDTO;
import sk.tuke.gamestudio.checkersmonolith.dto.score.TopPlayerDTO;
import sk.tuke.gamestudio.checkersmonolith.entity.Score;
import sk.tuke.gamestudio.checkersmonolith.service.ScoreService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
public class ScoreController {

    private final ScoreService scoreService;

    /**
     * Сохранить очки победителя
     */
    @PostMapping
    public Score addScore(@RequestBody ScoreDTO scoreDTO) {
        return scoreService.addScore(scoreDTO.getNickname(), scoreDTO.getPoints());
    }

    /**
     * Получить все победы игрока
     */
    @GetMapping("/{nickname}")
    public List<Score> getScores(@PathVariable String nickname) {
        return scoreService.getScoresForPlayer(nickname);
    }

    /**
     * Получить топ игроков по сумме очков
     */
    @GetMapping("/top")
    public List<TopPlayerDTO> getTopPlayers() {
        return scoreService.getTopPlayers().stream()
                .map(row -> new TopPlayerDTO(
                        (String) row[0], ((Number) row[1]).intValue()
                ))
                .collect(Collectors.toList());
    }
}