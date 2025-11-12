package sk.tuke.gamestudio.checkersmonolith.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sk.tuke.gamestudio.checkersmonolith.entity.Rating;
import sk.tuke.gamestudio.checkersmonolith.repository.RatingRepository;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;

    public Rating addOrUpdateRating(String player, int ratingValue) {
        return ratingRepository.findByPlayer(player)
                .map(existingRating -> {
                    existingRating.setRating(ratingValue);
                    return ratingRepository.save(existingRating);
                })
                .orElseGet(() -> ratingRepository.save(new Rating(player, ratingValue)));
    }

    @Transactional(readOnly = true)
    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    public double getAverageRating() {
        return ratingRepository.findAll().stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);
    }

    @Transactional(readOnly = true)
    public long getRatingCount() {
        return ratingRepository.count();
    }

    public void reset() {
        ratingRepository.deleteAll();
    }
}