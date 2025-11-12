package sk.tuke.gamestudio.checkersmonolith.dto.score;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class ScoreDTO {
    private String nickname;
    private int points;
}