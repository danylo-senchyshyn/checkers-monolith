package sk.tuke.gamestudio.checkersmonolith.dto.rating;

import lombok.*;

@Getter @Setter
public class RatingRequest {
    private String player;
    private int rating;
}