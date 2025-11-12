package sk.tuke.gamestudio.checkersmonolith.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "games")
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String winnerNickname;

    @Column(nullable = false)
    private String loserNickname;

    @Column(nullable = false, updatable = false)
    private LocalDateTime playedOn;

    public Game (String winnerNickname, String loserNickname) {
        this.winnerNickname = winnerNickname;
        this.loserNickname = loserNickname;
        this.playedOn = LocalDateTime.now();
    }
}