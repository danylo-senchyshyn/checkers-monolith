package sk.tuke.gamestudio.checkersmonolith.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.tuke.gamestudio.checkersmonolith.dto.rating.RatingRequest;
import sk.tuke.gamestudio.checkersmonolith.entity.Rating;
import sk.tuke.gamestudio.checkersmonolith.service.RatingService;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    /** Добавить или обновить рейтинг игрока */
    @PostMapping
    public void addRating(@RequestBody RatingRequest request) {
        ratingService.addOrUpdateRating(request.getPlayer(), request.getRating());
    }

    /** Получить все рейтинги */
    @GetMapping("/all")
    public List<Rating> getAllRatings() {
        return ratingService.getAllRatings();
    }

    /** Получить средний рейтинг */
    @GetMapping("/average")
    public double getAverageRating() {
        return ratingService.getAverageRating();
    }

    /** Получить количество рейтингов */
    @GetMapping("/count")
    public long getRatingCount() {
        return ratingService.getRatingCount();
    }

    /** Сброс всех рейтингов */
    @DeleteMapping
    public void resetRatings() {
        ratingService.reset();
    }
}