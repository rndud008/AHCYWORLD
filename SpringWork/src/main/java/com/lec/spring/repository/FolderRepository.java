package com.lec.spring.repository;

import com.lec.spring.domain.BoardType;
import com.lec.spring.domain.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FolderRepository extends JpaRepository<Folder,Long> {
}
