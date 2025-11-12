package sk.tuke.gamestudio.checkersmonolith.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sk.tuke.gamestudio.checkersmonolith.entity.Score;
import sk.tuke.gamestudio.checkersmonolith.repository.ScoreRepository;

import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepository;

    public ScoreService(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    @Transactional
    public Score addScore(String nickname, int points) {
        Score score = new Score(nickname, points);
        return scoreRepository.save(score);
    }

    @Transactional(readOnly = true)
    public List<Score> getScoresForPlayer(String nickname) {
        return scoreRepository.findByNickname(nickname);
    }

    @Transactional(readOnly = true)
    public List<Object[]> getTopPlayers() {
        return scoreRepository.findTopPlayers();
    }

    public void reset() {
        scoreRepository.deleteAll();
    }
}