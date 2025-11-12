package sk.tuke.gamestudio.checkersmonolith.dto.score;

import lombok.Getter;

@Getter
public class TopPlayerDTO {
    private String nickname;
    private int totalPoints;

    public TopPlayerDTO(String nickname, int totalPoints) {
        this.nickname = nickname;
        this.totalPoints = totalPoints;
    }
}