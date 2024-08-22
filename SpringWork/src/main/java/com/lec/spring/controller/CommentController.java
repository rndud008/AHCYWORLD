package com.lec.spring.controller;

import com.lec.spring.domain.Comment;
import com.lec.spring.domain.QryCommentList;
import com.lec.spring.domain.QryResult;
import com.lec.spring.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/list/{postId}")
    @CrossOrigin
    public QryCommentList list(@PathVariable("postId") Long postId) {
        return commentService.list(postId);
    }

    // 댓글 작성
    @PostMapping("/write")
    @CrossOrigin
    public QryResult write(@RequestBody Comment comment) {
        return commentService.write(comment.getPost().getId(), comment.getUser().getId(), comment.getContent());
    }

    // 댓글삭제
    @CrossOrigin
    @DeleteMapping("/delete/{commentId}")
    public QryResult delete(@PathVariable("commentId") Long commentId) {
        return commentService.delete(commentId);
    }
}
