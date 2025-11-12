package sk.tuke.gamestudio.checkersmonolith.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sk.tuke.gamestudio.checkersmonolith.entity.User;
import sk.tuke.gamestudio.checkersmonolith.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createOrUpdateUser(String nickname, String avatarUrl) {
        User user = userRepository.findByNickname(nickname);

        if (user == null) {
            user = new User(nickname, avatarUrl);
        } else {
            user.setAvatarUrl(avatarUrl);
            user.setLastActive(LocalDateTime.now());
        }

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUser(String nickname) {
        return userRepository.findByNickname(nickname);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void reset() {
        userRepository.deleteAll();
    }
}