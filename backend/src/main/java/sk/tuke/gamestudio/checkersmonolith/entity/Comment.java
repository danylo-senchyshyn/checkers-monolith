package sk.tuke.gamestudio.checkersmonolith.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter @Setter @NoArgsConstructor @ToString @EqualsAndHashCode
public class Comment implements Serializable  {
    @Id
    @GeneratedValue
    private int ident;

    @Column(nullable = false, unique = true)
    private String player;

    @Column(nullable = false)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime commentedOn;

    public Comment(String player, String comment) {
        this.player = player;
        this.comment = comment;
        this.commentedOn = LocalDateTime.now();
    }
}