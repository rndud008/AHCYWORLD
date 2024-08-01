package com.lec.spring.service;

import com.lec.spring.domain.BoardType;
import com.lec.spring.domain.Folder;
import com.lec.spring.domain.Hompy;
import com.lec.spring.repository.BoardTypeRepository;
import com.lec.spring.repository.FolderRepository;
import com.lec.spring.repository.HompyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public int insert(String folderName, long boardTypeId, long hompyId){
        int result = 0;
        Folder folder = new Folder();
        boolean check = !folderName.trim().isEmpty();

        if(check){
            Hompy hompy = hompyRepository.findById(hompyId).orElse(null);
            BoardType boardType = boardTypeRepository.findById(boardTypeId).orElse(null);

            folder.setName(folderName);
            folder.setHompy(hompy);
            folder.setBoardType(boardType);

            folderRepository.save(folder);
            result = 1;
        }

        return result;
    }

    @Transactional
    public Folder update(Folder folder){
        int result = 0;
        boolean check = !folder.getName().trim().isEmpty();
        if(!check){
            return null;
        }

        Folder originFolder = folderRepository.findById(folder.getId()).orElse(null);

        if(originFolder != null){

            originFolder.setName(folder.getName());
            originFolder.setStatus(folder.getStatus());

        }

        return originFolder;
    }

    @Transactional
    public int remove(Long folderId){
        int result = 0;

        if(folderRepository.existsById(folderId)){
            folderRepository.deleteById(folderId);
            result = 1;
        }

        return result;
    }
}
