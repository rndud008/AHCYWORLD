package com.lec.spring.repository;

import com.lec.spring.domain.Folder;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface PostRepository extends JpaRepository<Post,Long> {
    Page<Post> findByFolder(Folder folder, PageRequest pageRequest);

    List<Post> findByFolderHompyAndFolderStatusInOrderByIdDesc(Hompy hompy, Pageable pageable, List<String> status);
    List<Post> findByFolderHompyAndFolderStatusInOrderByIdDesc(Hompy hompy, List<String> status);

    List<Post> findByFolderHompyAndFolderBoardTypeNameInAndFolderStatusInOrderByIdDesc(Hompy hompy, Pageable pageable, List<String> boardTypeName, List<String> status);
}
