package sk.tuke.gamestudio.checkersmonolith.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class Rating implements Serializable {
    @Id
    @GeneratedValue
    private int ident;

    @Column(nullable = false, unique = true)
    private String player;

    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private LocalDateTime ratedOn;

    public Rating(String player, int rating) {
        this.player = player;
        this.rating = rating;
        this.ratedOn = LocalDateTime.now();
    }
}
