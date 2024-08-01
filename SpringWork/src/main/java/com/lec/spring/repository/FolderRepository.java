package com.lec.spring.repository;

import com.lec.spring.domain.BoardType;
import com.lec.spring.domain.Folder;
import com.lec.spring.domain.Hompy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FolderRepository extends JpaRepository<Folder,Long> {
    Optional<Folder> findByHompy(Hompy hompy);

    Optional<List<Folder>> findByBoardType(BoardType boardType);
}
