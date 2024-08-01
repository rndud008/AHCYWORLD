package com.lec.spring.controller;

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
    public QryCommentList list(@PathVariable("postId") Long postId) {
        return commentService.list(postId);
    }

    // 댓글 작성
    @PostMapping("/write")
    public QryResult write(
            @RequestParam("post_id") Long postId,
            @RequestParam("user_id") Long userId,
            String content) {
        return commentService.write(postId, userId, content);
    }

    // 댓글삭제
    @PostMapping("/delete/{commentId}")
    public QryResult delete(@PathVariable("commentId") Long commentId) {
        return commentService.delete(commentId);
    }
}
