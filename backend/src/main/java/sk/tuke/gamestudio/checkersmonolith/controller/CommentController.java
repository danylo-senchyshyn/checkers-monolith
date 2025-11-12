package sk.tuke.gamestudio.checkersmonolith.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.tuke.gamestudio.checkersmonolith.entity.Comment;
import sk.tuke.gamestudio.checkersmonolith.service.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /** Добавить комментарий игрока */
    @PostMapping
    public void addComment(@RequestBody Comment comment) {
        commentService.addComment(comment.getPlayer(), comment.getComment());
    }

    /** Получить все комментарии */
    @GetMapping("/all")
    public List<Comment> getAllComments() {
        return commentService.getAllComments();
    }

    /** Получить количество комментариев */
    @GetMapping("/count")
    public long getCommentCount() {
        return commentService.getCommentCount();
    }

    /** Сброс всех комментариев */
    @DeleteMapping
    public void resetComments() {
        commentService.reset();
    }
}