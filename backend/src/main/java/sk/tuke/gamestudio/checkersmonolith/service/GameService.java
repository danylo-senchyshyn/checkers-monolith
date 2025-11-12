package sk.tuke.gamestudio.checkersmonolith.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sk.tuke.gamestudio.checkersmonolith.dto.game.*;
import sk.tuke.gamestudio.checkersmonolith.entity.Game;
import sk.tuke.gamestudio.checkersmonolith.repository.GameRepository;
import sk.tuke.gamestudio.checkersmonolith.game.figures.*;
import sk.tuke.gamestudio.checkersmonolith.game.CheckersField;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Transactional
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;

    // Игровая сессия в памяти
    private CheckersField currentField;
    private PlayerDTO whitePlayer;
    private PlayerDTO blackPlayer;
    private final AtomicInteger gameIdCounter = new AtomicInteger(1);
    private Integer currentGameId = null;
    private boolean finished = false;

    // ===== Игровая логика =====

    public synchronized int startNewGame(String white, String black, String whiteAvatarUrl, String blackAvatarUrl) {
        this.currentField = new CheckersField();
        this.whitePlayer = new PlayerDTO(white, whiteAvatarUrl);
        this.blackPlayer = new PlayerDTO(black, blackAvatarUrl);
        this.currentGameId = gameIdCounter.getAndIncrement();
        return currentGameId;
    }

    public synchronized GameStateDTO getState() {
        if (currentField == null) return null;
        return mapToDto(currentGameId, currentField);
    }

    public synchronized List<int[]> getPossibleMoves(int row, int col) {
        if (currentField == null) return Collections.emptyList();
        return currentField.getPossibleMoves(row, col);
    }

    public synchronized boolean makeMove(int fromRow, int fromCol, int toRow, int toCol) {
        if (currentField == null) return false;
        boolean ok = currentField.move(fromRow, fromCol, toRow, toCol);
        if (ok && isFinished(currentField)) {
            finishAndSaveIfNeeded();
        }
        return ok;
    }

    public synchronized void resign(String resigningPlayer) {
        if (currentField == null) return;

        String winner, loser;
        if (resigningPlayer.equals(whitePlayer.getNickname())) {
            winner = blackPlayer.getNickname();
            loser = whitePlayer.getNickname();
        } else {
            winner = whitePlayer.getNickname();
            loser = blackPlayer.getNickname();
        }

        saveGameResult(winner, loser);

        currentField = null;
        currentGameId = null;
    }

    private boolean isFinished(CheckersField field) {
        return field.getGameState() != null &&
                (field.getGameState().name().contains("WON") || field.getGameState().name().equals("DRAW"));
    }

    private void finishAndSaveIfNeeded() {
        if (!isFinished(currentField)) return;

        String winner, loser;
        switch (currentField.getGameState()) {
            case WHITE_WON -> {
                winner = whitePlayer.getNickname();
                loser = blackPlayer.getNickname();
            }
            case BLACK_WON -> {
                winner = blackPlayer.getNickname();
                loser = whitePlayer.getNickname();
            }
            default -> {
                currentField = null;
                currentGameId = null;
                return;
            }
        }
        saveGameResult(winner, loser);
        finished = true;
    }

    private void saveGameResult(String winner, String loser) {
        Game g = new Game(winner, loser);
        gameRepository.save(g);
    }

    // ===== Работа с базой данных =====

    @Transactional(readOnly = true)
    public List<Game> getAllGames() {
        return gameRepository.findAllByOrderByPlayedOnDesc();
    }

    @Transactional(readOnly = true)
    public List<Game> getGamesByPlayer(String nickname) {
        return gameRepository.findByWinnerNicknameOrLoserNicknameOrderByPlayedOnDesc(nickname, nickname);
    }

    public void reset() {
        gameRepository.deleteAll();
    }

    // ===== Mapper =====

    private GameStateDTO mapToDto(int gid, CheckersField field) {
        int size = CheckersField.SIZE;
        String[][] board = new String[size][size];
        Tile[][] tiles = field.getField();

        for (int r = 0; r < size; r++) {
            for (int c = 0; c < size; c++) {
                board[r][c] = tiles[r][c].getState().name();
            }
        }

        List<MoveDTO> log = field.getMovesLog();

        return new GameStateDTO(
                gid,
                board,
                field.isWhiteTurn() ? "WHITE" : "BLACK",
                field.getScoreWhite(),
                field.getScoreBlack(),
                field.getGameState() == null ? "PLAYING" : field.getGameState().name(),
                field.isLastCaptured(),
                field.isLastBecameKing(),
                whitePlayer,
                blackPlayer,
                log
        );
    }
}