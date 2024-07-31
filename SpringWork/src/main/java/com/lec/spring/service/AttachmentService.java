package com.lec.spring.service;

import com.lec.spring.repository.AttachmentRepository;
import com.lec.spring.repository.PostRepository;
import org.springframework.stereotype.Service;

@Service
public class AttachmentService {

    private  final PostRepository postRepository;
    private  final AttachmentRepository attachmentRepository;

    public AttachmentService(PostRepository postRepository, AttachmentRepository attachmentRepository) {
        this.postRepository = postRepository;
        this.attachmentRepository = attachmentRepository;
    }



}
