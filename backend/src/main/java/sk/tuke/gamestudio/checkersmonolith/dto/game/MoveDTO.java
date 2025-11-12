package sk.tuke.gamestudio.checkersmonolith.dto.game;

import lombok.Getter;

@Getter
public class MoveDTO {
    private int fromRow;
    private int fromCol;
    private int toRow;
    private int toCol;
    private boolean captured;
    private boolean becameKing;
    private String player; // "WHITE" или "BLACK"

    public MoveDTO(int fromRow, int fromCol,
                   int toRow, int toCol,
                   boolean captured,
                   boolean becameKing,
                   String player) {
        this.fromRow = fromRow;
        this.fromCol = fromCol;
        this.toRow = toRow;
        this.toCol = toCol;
        this.captured = captured;
        this.becameKing = becameKing;
        this.player = player;
    }
}