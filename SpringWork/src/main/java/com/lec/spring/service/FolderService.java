package com.lec.spring.service;

import com.lec.spring.domain.BoardType;
import com.lec.spring.domain.Folder;
import com.lec.spring.domain.Friend;
import com.lec.spring.domain.Hompy;
import com.lec.spring.repository.BoardTypeRepository;
import com.lec.spring.repository.FolderRepository;
import com.lec.spring.repository.FriendRepository;
import com.lec.spring.repository.HompyRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
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
    public Folder write(Folder folder, Hompy hompy, BoardType boardType) {

        folder.setHompy(hompy);
        folder.setBoardType(boardType);
        folderRepository.save(folder);

        return folder;
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

    public List<Folder> folderListByBoardType(BoardType boardType, Hompy miniHompy, Friend friend, String action) {
        List<Folder> folderList = new ArrayList<>();
        List<Folder> folders = new ArrayList<>();

        if (action.equals("OWNER")) {
            folderList = folderRepository.findByBoardTypeAndHompy(boardType, miniHompy, Sort.by(Sort.Order.asc("id"))).orElse(null);
        } else if (action.equals("OTHER") && friend == null) {
            folderList = folderRepository
                    .findByBoardTypeAndHompyAndStatus(boardType, miniHompy, Sort.by(Sort.Order.asc("id")), "전체공개").orElse(null);
        } else if (action.equals("OTHER")) {
            folderList = folderRepository
                    .findByBoardTypeAndHompyAndStatusIn
                            (boardType, miniHompy, Sort.by(Sort.Order.asc("id")), Arrays.asList("전체공개","일촌공개")).orElse(null);



        }

        return folderList;
    }

    public List<Folder> scrapFolderListByBoardType(BoardType boardType, Hompy miniHompy) {

        return folderRepository
                .findByBoardTypeAndHompy
                        (boardType, miniHompy, Sort.by(Sort.Order.asc("id"))).orElse(null);
    }


}
