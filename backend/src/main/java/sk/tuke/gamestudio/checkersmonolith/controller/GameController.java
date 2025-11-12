package sk.tuke.gamestudio.checkersmonolith.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.tuke.gamestudio.checkersmonolith.dto.game.*;
import sk.tuke.gamestudio.checkersmonolith.service.GameService;

import java.util.List;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    /** 1) Начать новую игру */
    @PostMapping("/start")
    public GameStateDTO startGame(@RequestBody StartGameRequest req) {
        if (req.getWhitePlayer() == null || req.getBlackPlayer() == null) {
            throw new IllegalArgumentException("Players cannot be null");
        }

        gameService.startNewGame(
                req.getWhitePlayer(),
                req.getBlackPlayer(),
                req.getWhiteAvatarUrl(),
                req.getBlackAvatarUrl()
        );

        return gameService.getState();
    }

    /** 2) Получить состояние текущей игры */
    @GetMapping
    public GameStateDTO getState() {
        GameStateDTO state = gameService.getState();
        if (state == null) {
            throw new IllegalStateException("No active game");
        }
        return state;
    }

    /** 3) Получить возможные ходы для ячейки */
    @GetMapping("/moves")
    public PossibleMovesDTO getPossibleMoves(@RequestParam int row,
                                             @RequestParam int col) {

        List<int[]> moves = gameService.getPossibleMoves(row, col);
        return new PossibleMovesDTO(0, row, col, moves);
    }

    /** 4) Сделать ход */
    @PostMapping("/move")
    public GameStateDTO makeMove(@RequestBody MoveRequest req) {
        boolean ok = gameService.makeMove(req.getFromRow(), req.getFromCol(), req.getToRow(), req.getToCol());

        if (!ok) {
            throw new IllegalArgumentException("Invalid move");
        }

        return gameService.getState();
    }

    /** 5) Сдаться */
    @PostMapping("/resign")
    public String resign(@RequestParam String player) {
        gameService.resign(player);
        return "Resigned and result saved.";
    }
}