package sk.tuke.gamestudio.checkersmonolith.dto.game;

import lombok.Data;

@Data
public class StartGameRequest {
    private String whitePlayer;
    private String blackPlayer;
    private String whiteAvatarUrl;
    private String blackAvatarUrl;
}