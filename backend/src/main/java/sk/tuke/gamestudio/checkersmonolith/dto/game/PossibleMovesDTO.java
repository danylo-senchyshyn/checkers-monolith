package sk.tuke.gamestudio.checkersmonolith.dto.game;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PossibleMovesDTO {
    private int gameId;
    private int row;
    private int col;
    private List<int[]> moves; // list of {row, col}
}