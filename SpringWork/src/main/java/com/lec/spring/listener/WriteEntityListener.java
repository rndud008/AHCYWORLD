package com.lec.spring.listener;

import com.lec.spring.domain.*;
import com.lec.spring.repository.*;
import com.lec.spring.support.BeanUtils;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostUpdate;
import jakarta.persistence.PreRemove;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.util.Optional;

public class WriteEntityListener {

    @PostPersist
    public void postPerrsist(Object o) {
        if (o instanceof Post) {
            Post post = (Post) o;
            userWriteHistory(post, "INSERT");
        }
        if (o instanceof Comment) {
            Comment comment = (Comment) o;
            commentHistory(comment, "INSERT");
        }
        if (o instanceof GuestBook) {
            GuestBook guestBook = (GuestBook) o;
            guestBookHistory(guestBook, "INSERT");
        }
    }

    @PostUpdate
    public void postUpdate(Object o) {
        if (o instanceof Post) {
            Post post = (Post) o;
            if (post.isUpdateViews()) {
                userWriteHistory(post, "UPDATE");
            }
            post.setUpdateViews(true);
        }

    }

    @PreRemove
    public void preRemove(Object o) {
        if (o instanceof Post) {
            Post post = (Post) o;
            userWriteHistory(post, "DELETE");
        }
        if (o instanceof Comment) {
            Comment comment = (Comment) o;
            commentHistory(comment, "DELETE");
        }
        if (o instanceof GuestBook) {
            GuestBook guestBook = (GuestBook) o;
            guestBookHistory(guestBook, "DELETE");
        }
    }

    private void userWriteHistory(Post post, String action) {
        UserWriteHistoryRepository userWriteHistoryRepository =
                BeanUtils.getBean(UserWriteHistoryRepository.class);

        UserWriteHistroy userWriteHistroy = new UserWriteHistroy();
        userWriteHistroy.setHompy(post.getFolder().getHompy());
        userWriteHistroy.setPostType(post.getFolder().getBoardType().getName());
        userWriteHistroy.setPostId(post.getId());
        userWriteHistroy.setSubject(post.getSubject());
        userWriteHistroy.setContent(post.getContent());
        userWriteHistroy.setStatus(action);
        userWriteHistroy.setUsername(post.getFolder().getHompy().getUser().getUsername());

        if (!post.getFileList().isEmpty()) {
            userWriteHistroy.setAttachmentList(post.getFileList());
        }
        userWriteHistoryRepository.save(userWriteHistroy);


    }

    private void commentHistory(Comment comment, String action) {

        UserWriteHistroy userWriteHistroy = new UserWriteHistroy();
        UserWriteHistoryRepository userWriteHistoryRepository =
                BeanUtils.getBean(UserWriteHistoryRepository.class);

        userWriteHistroy.setHompy(comment.getPost().getFolder().getHompy());

        userWriteHistroy.setPostId(comment.getPost().getId());
        userWriteHistroy.setSubject("ID: "+comment.getPost().getId()+"번 게시물의 댓글");
        userWriteHistroy.setContent(comment.getContent());
        userWriteHistroy.setPostType(comment.getPost().getFolder().getBoardType().getName()+"의 댓글");
        userWriteHistroy.setUsername(comment.getUser().getUsername());
        userWriteHistroy.setStatus(action);

        userWriteHistoryRepository.save(userWriteHistroy);

    }

    private void guestBookHistory(GuestBook guestBook,String action){

        UserWriteHistroy userWriteHistroy = new UserWriteHistroy();
        UserWriteHistoryRepository userWriteHistoryRepository =
                BeanUtils.getBean(UserWriteHistoryRepository.class);

        userWriteHistroy.setHompy(guestBook.getHompy());
        userWriteHistroy.setPostId(guestBook.getId());
        // 게스트북 id 저장.
        userWriteHistroy.setSubject("");
        userWriteHistroy.setContent(guestBook.getContent());

        String guestBookName = guestBook.getGuestBookName().equals("friendReview") ? "일촌평" : "방명록";

        userWriteHistroy.setPostType(guestBookName);
        userWriteHistroy.setUsername(guestBook.getUser().getUsername());
        userWriteHistroy.setStatus(action);

        userWriteHistoryRepository.save(userWriteHistroy);

    }
}
