package com.lec.spring.repository;

import com.lec.spring.domain.BoardType;
import com.lec.spring.domain.Folder;
import com.lec.spring.domain.Hompy;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FolderRepository extends JpaRepository<Folder,Long> {
    Optional<List<Folder>> findByBoardTypeAndHompy(BoardType boardType, Hompy hompy, Sort sort);
    Optional<List<Folder>> findByBoardTypeAndHompyAndStatusIn(BoardType boardType, Hompy hompy, Sort sort,List<String> all);
    Optional<List<Folder>> findByBoardTypeAndHompyAndStatus(BoardType boardType, Hompy hompy, Sort sort,String all);


}
