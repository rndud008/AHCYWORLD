package com.lec.spring.service;

import com.lec.spring.repository.FolderRepository;
import com.lec.spring.repository.PostRepository;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    private final FolderRepository folderRepository;
    private final PostRepository postRepository;

    // user Repository 등록

    public PostService(FolderRepository folderRepository, PostRepository postRepository) {
        this.folderRepository = folderRepository;
        this.postRepository = postRepository;
    }

}
