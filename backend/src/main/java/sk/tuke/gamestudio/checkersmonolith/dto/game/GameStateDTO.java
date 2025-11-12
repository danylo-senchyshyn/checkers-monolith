package sk.tuke.gamestudio.checkersmonolith.dto.game;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GameStateDTO {
    private int gameId;
    private String[][] board;
    private String currentTurn;   // "WHITE" or "BLACK"
    private int whiteScore;
    private int blackScore;
    private String state;         // "PLAYING", "WHITE_WON", "BLACK_WON", "DRAW"
    private boolean lastCaptured;
    private boolean lastBecameKing;

    private PlayerDTO whitePlayer;
    private PlayerDTO blackPlayer;

    private List<MoveDTO> moveHistory;
}