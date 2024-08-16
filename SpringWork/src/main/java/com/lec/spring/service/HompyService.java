package com.lec.spring.service;

import com.lec.spring.domain.Folder;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.Post;
import com.lec.spring.domain.User;
import com.lec.spring.repository.FolderRepository;
import com.lec.spring.repository.HompyRepository;
import com.lec.spring.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HompyService {

    private final HompyRepository hompyRepository;
    private final FolderRepository hompyFolderRepository;
    private final PostRepository postRepository;
    private final FolderRepository folderRepository;

    public HompyService(HompyRepository hompyRepository
            , FolderRepository hompyFolderRepository, PostRepository postRepository, FolderRepository folderRepository) {
        this.hompyRepository = hompyRepository;
        this.hompyFolderRepository = hompyFolderRepository;
        this.postRepository = postRepository;
        this.folderRepository = folderRepository;
    }

    public Hompy findById(Long id) {
        return hompyRepository.findById(id).orElse(null);
    }

    // 특정 User에 해당하는 Hompy 조회
    public Hompy findHompyByuser(User user) {
        return hompyRepository.findByUser(user);
    }

    // 기존 미니홈피 업데이트
    public Hompy updateHompy(Hompy hompy) {
        return hompyRepository.save(hompy);
    }

    // 프로필 사진
    public Hompy updateProfilePicture(User user, String profilePicture) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setProfilePicture(profilePicture);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    // 상태 메시지
    public Hompy updateStatusMessage(User user, String statusMessage) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setStatusMessage(statusMessage);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    // 미니미
    public Hompy minimi(User user, String minimiPicture) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setMinimiPicture(minimiPicture);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    // 미니룸
    public Hompy miniRoom(User user, String miniRoomPicture) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setMiniRoom(miniRoomPicture);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    // 미니홈피 스킨
    public Hompy miniHompySkin(User user, String miniHompySkinPicture) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setMiniHompySkin(miniHompySkinPicture);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    // 방문자 수
    public Hompy visitCnt(User user) {
        Hompy hompy = hompyRepository.findByUser(user);
        hompy.setTodayVisitor(hompy.getTodayVisitor() + 1);
        hompy.setTotalVisitor(hompy.getTotalVisitor() + 1);
        return hompyRepository.save(hompy);
    }

    // 프로필 (간단한 자기소개?)
    public Hompy userProfile(User user, String profile) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setProfile(profile);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    public List<Hompy> hompyList() {
        return hompyRepository.findAll();
    }

    public String resetHompy(Hompy hompy) {

        hompy.setProfilePicture(null);
        hompy.setStatusMessage(null);
        hompy.setTodayVisitor(0L);
        hompy.setTotalVisitor(0L);
        hompy.setMiniHompySkin(null);
        hompy.setMiniRoom(null);
        hompy.setMinimiPicture(null);
        hompy.setProfile(null);
        hompy.setMenuColor("#147DAF,#FFF,#147DAF");
        hompy.setMenuStatus("visible,visible,visible,visible");


        hompy = hompyRepository.saveAndFlush(hompy);
        System.out.println(hompy);

        List<Folder> folderList = folderRepository.findAll();
//        List<Post> postList = postRepository.findAll();

        for (Folder folder : folderList) {
            if (folder.getHompy().getId() == hompy.getId()) {
                folderRepository.delete(folder);
//                for (Post post : postList) {
//                    if (post.getFolder().getId() == folder.getId()) {
//                        postRepository.delete(post);
//                    }
//                }
            }
        }


        return "success";
    }

    // 메뉴색상 및 보이기 숨기기
    public Hompy updateMenuSettings(User user, String menuColor, String menuStatus, String menuText, String menuBorder) {
        Hompy hompy = hompyRepository.findByUser(user);
        if (hompy != null) {
            hompy.setMenuColor(menuColor);
            hompy.setMenuStatus(menuStatus);
            hompy.setMenuText(menuText);
            hompy.setMenuBorder(menuBorder);
            return hompyRepository.save(hompy);
        } else {
            throw new RuntimeException("해당 유저의 홈피를 찾을 수 없습니다.");
        }
    }

    // 홈피 타이틀 변경.
    @Transactional
    public Hompy updateHompyTitle(Hompy hompy, String hompyTitle){
        hompy.setTitle(hompyTitle);
        return hompy;
    }
}
