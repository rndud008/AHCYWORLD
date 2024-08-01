package com.lec.spring.service;

import com.lec.spring.domain.QryCommentList;
import com.lec.spring.domain.QryResult;

public interface CommentService {

    // 댓글 목록
    QryCommentList list(Long postId);

    // 댓글 작성
    QryResult write(Long postId, Long userId, String content);

    // 댓글 삭제
    QryResult delete(Long id);
}
