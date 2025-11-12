package sk.tuke.gamestudio.checkersmonolith.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sk.tuke.gamestudio.checkersmonolith.entity.Game;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {
    // Найти игры, где игрок был победителем или проигравшим
    List<Game> findByWinnerNicknameOrLoserNicknameOrderByPlayedOnDesc(String winner, String loser);

    // Все игры отсортированные по дате (DESC)
    List<Game> findAllByOrderByPlayedOnDesc();
}