package sk.tuke.gamestudio.checkersmonolith.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "scores")
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class Score implements Serializable {
    @Id
    @GeneratedValue
    private int ident;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private int points;

    @Column(nullable = false, updatable = false)
    private LocalDateTime achievedOn;

    public Score(String nickname, int points) {
        this.nickname = nickname;
        this.points = points;
        this.achievedOn = LocalDateTime.now();
    }
}