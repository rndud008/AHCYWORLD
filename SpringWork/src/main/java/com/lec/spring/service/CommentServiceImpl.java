package com.lec.spring.service;

import com.lec.spring.domain.*;
import com.lec.spring.repository.CommentRepository;
import com.lec.spring.repository.PostRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public CommentServiceImpl(CommentRepository commentRepository, UserRepository userRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }


    @Override
    public QryCommentList list(Long postId) {
        QryCommentList list = new QryCommentList();

        List<Comment> comments = commentRepository.findByPostId(postId, Sort.by(Sort.Order.desc("id")));

        list.setCount(comments.size());
        list.setList(comments);
        list.setStatus("OK");

        return list;
    }

    @Override
    public QryResult write(Long postId, Long userId, String content) {
        User user = userRepository.findById(userId).orElse(null);
        Post post = postRepository.findById(postId).orElse(null);

        if (user == null) {
            System.out.println("User not found for ID: " + userId);
        }
        if (post == null) {
            System.out.println("Post not found for ID: " + postId);
        }

        if (user != null && post != null) {
            Comment comment = Comment.builder()
                    .user(user)
                    .content(content)
                    .post(post)
                    .build();

            commentRepository.save(comment);

            return QryResult.builder()
                    .count(1)
                    .status("OK")
                    .build();
        } else {
            return QryResult.builder()
                    .count(0)
                    .status("FAIL")
                    .build();
        }
    }

    @Override
    public QryResult delete(Long commentId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isPresent()) {
            commentRepository.delete(comment.get());
            return new QryResult(1, "SUCCESS");
        } else {
            return new QryResult(0, "FAIL");
        }
    }
}
