package sk.tuke.gamestudio.checkersmonolith.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sk.tuke.gamestudio.checkersmonolith.entity.Score;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Integer> {
    // все победы конкретного игрока
    List<Score> findByNickname(String nickname);

    // топ игроков по сумме очков
    @Query("SELECT s.nickname, SUM(s.points) as totalPoints " +
            "FROM Score s GROUP BY s.nickname ORDER BY totalPoints DESC")
    List<Object[]> findTopPlayers();
}