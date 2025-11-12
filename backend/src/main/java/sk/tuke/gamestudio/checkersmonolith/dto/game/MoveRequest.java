package sk.tuke.gamestudio.checkersmonolith.dto.game;

import lombok.Data;

@Data
public class MoveRequest {
    private int fromRow;
    private int fromCol;
    private int toRow;
    private int toCol;
}