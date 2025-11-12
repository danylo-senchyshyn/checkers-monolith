package sk.tuke.gamestudio.checkersmonolith.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import sk.tuke.gamestudio.checkersmonolith.entity.Comment;
import sk.tuke.gamestudio.checkersmonolith.repository.CommentRepository;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public Comment addComment(String player, String text) {
        return commentRepository.save(new Comment(player, text));
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public long getCommentCount() {
        return commentRepository.count();
    }

    public void reset() {
        commentRepository.deleteAll();
    }
}