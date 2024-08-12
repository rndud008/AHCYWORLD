package com.lec.spring.listener;

import com.lec.spring.domain.Attachment;
import com.lec.spring.domain.Post;
import com.lec.spring.domain.UserWriteHistroy;
import com.lec.spring.repository.AttachmentRepository;
import com.lec.spring.repository.PostRepository;
import com.lec.spring.repository.UserWriteHistoryRepository;
import com.lec.spring.support.BeanUtils;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostUpdate;
import jakarta.persistence.PreRemove;

import java.util.List;
import java.util.Optional;

public class WriteEntityListener {

    @PostPersist
    public void postPerrsist(Object o){
        if (o instanceof Post){
            Post post = (Post) o;
            userWriteHistory(post,"INSERT");
        }
        if(o instanceof Attachment){
            Attachment attachment = (Attachment) o;
            attachmentHistyroy(attachment,"INSERT");
        }
    }

    @PostUpdate
    public void postUpdate(Object o){
        if(o instanceof Post){
            Post post = (Post) o;
            if(post.isUpdateViews()){
            userWriteHistory(post,"UPDATE");
            }
            post.setUpdateViews(true);
        }
        if(o instanceof Attachment){
            Attachment attachment = (Attachment) o;
            attachmentHistyroy(attachment,"UPDATE");
        }
    }

    @PreRemove
    public void preRemove(Object o){
        if(o instanceof Post){
            Post post = (Post) o;
            userWriteHistory(post,"DELETE");
        }
        if(o instanceof Attachment){
            Attachment attachment = (Attachment) o;
            attachmentHistyroy(attachment,"DELETE");
        }
    }




    private void userWriteHistory(Post post, String action){
        UserWriteHistoryRepository userWriteHistoryRepository =
                BeanUtils.getBean(UserWriteHistoryRepository.class);

        UserWriteHistroy userWriteHistroy = new UserWriteHistroy();
        System.out.println("userWriteHistory : "+ post.getId());

        userWriteHistroy.setHompy(post.getFolder().getHompy());
        userWriteHistroy.setPostType(post.getFolder().getBoardType().getName());
        userWriteHistroy.setPostId(post.getId());
        userWriteHistroy.setSubject(post.getSubject());
        userWriteHistroy.setContent(post.getContent());
        userWriteHistroy.setStatus(action);
        userWriteHistroy.setUsername(post.getFolder().getHompy().getUser().getUsername());

        if(!post.getFileList().isEmpty()){
            userWriteHistroy.setAttachmentList(post.getFileList());
        }

        userWriteHistoryRepository.save(userWriteHistroy);
        System.out.println(action+ "저장 완료." + post.getViewCnt());

    }

    private void attachmentHistyroy(Attachment attachment, String action){

        UserWriteHistroy userWriteHistroy = new UserWriteHistroy();
        UserWriteHistoryRepository userWriteHistoryRepository =
                BeanUtils.getBean(UserWriteHistoryRepository.class);
        PostRepository postRepository = BeanUtils.getBean(PostRepository.class);

        Post post = postRepository.findById(attachment.getPost().getId()).orElse(null);

        if(post != null){
            userWriteHistroy.setHompy(post.getFolder().getHompy());
            userWriteHistroy.setSubject(post.getSubject());
            userWriteHistroy.setContent(post.getContent());
            userWriteHistroy.setAttachmentList(post.getFileList());
            userWriteHistroy.setPostType(post.getFolder().getBoardType().getName());
            userWriteHistroy.setUsername(post.getFolder().getHompy().getUser().getUsername());
            userWriteHistroy.setStatus(action);

            userWriteHistoryRepository.save(userWriteHistroy);

            System.out.println(action+ "저장 완료.");
        }

    }
}
