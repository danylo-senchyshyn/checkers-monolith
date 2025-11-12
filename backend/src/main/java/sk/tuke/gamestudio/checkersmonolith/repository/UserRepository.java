package sk.tuke.gamestudio.checkersmonolith.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sk.tuke.gamestudio.checkersmonolith.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByNickname(String nickname);
}