package com.lec.spring.service;

import com.lec.spring.domain.BoardType;
import com.lec.spring.domain.Folder;
import com.lec.spring.domain.Hompy;
import com.lec.spring.repository.BoardTypeRepository;
import com.lec.spring.repository.FolderRepository;
import com.lec.spring.repository.HompyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FolderService {
    private final BoardTypeRepository boardTypeRepository;
    private final FolderRepository folderRepository;
    private final HompyRepository hompyRepository;

    public FolderService(BoardTypeRepository boardTypeRepository, FolderRepository folderRepository, HompyRepository hompyRepository) {
        this.boardTypeRepository = boardTypeRepository;
        this.folderRepository = folderRepository;
        this.hompyRepository = hompyRepository;
    }

    public Folder findByHompy(Hompy hompy) {
        return folderRepository.findByHompy(hompy).orElse(null);
    }

    public Folder findById(Long id) {
        return folderRepository.findById(id).orElse(null);
    }

    @Transactional
    public int write(Folder folder, Hompy hompy, BoardType boardType) {

        folder.setHompy(hompy);
        folder.setBoardType(boardType);
        folderRepository.save(folder);

        return 1;
    }

    @Transactional
    public Folder update(Folder folder) {

        Folder originFolder = folderRepository.findById(folder.getId()).orElse(null);

        if (originFolder != null) {

            originFolder.setName(folder.getName());
            originFolder.setStatus(folder.getStatus());

        }

        return originFolder;
    }

    @Transactional
    public int deleteById(Long folderId) {
        int result = 0;

        if (folderRepository.existsById(folderId)) {
            folderRepository.deleteById(folderId);
            result = 1;
        }

        return result;
    }

    public List<Folder> folderListByBoardType(BoardType boardType){
        return folderRepository.findByBoardType(boardType).orElse(null);
    }

}
