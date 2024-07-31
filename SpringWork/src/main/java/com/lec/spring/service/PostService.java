package com.lec.spring.service;

import com.lec.spring.repository.FolderRepository;
import com.lec.spring.repository.PostRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    private final FolderRepository folderRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(FolderRepository folderRepository, PostRepository postRepository, UserRepository userRepository) {
        this.folderRepository = folderRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

}
