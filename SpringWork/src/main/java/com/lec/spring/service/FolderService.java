package com.lec.spring.service;

import com.lec.spring.repository.BoardTypeRepository;
import com.lec.spring.repository.FolderRepository;
import org.springframework.stereotype.Service;

@Service
public class FolderService {
    private final BoardTypeRepository boardTypeRepository;
    private final FolderRepository folderRepository;

    // 홈피 repository. 등록.

    public FolderService(BoardTypeRepository boardTypeRepository, FolderRepository folderRepository) {
        this.boardTypeRepository = boardTypeRepository;
        this.folderRepository = folderRepository;
    }
}
