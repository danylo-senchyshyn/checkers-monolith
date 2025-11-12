package sk.tuke.gamestudio.checkersmonolith.dto.game;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlayerDTO {
    private String nickname;
    private String avatarUrl;
}