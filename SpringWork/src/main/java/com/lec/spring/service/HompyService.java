package com.lec.spring.service;

import com.lec.spring.domain.*;
import com.lec.spring.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class HompyService {

    private final HompyRepository hompyRepository;
    private final FolderRepository hompyFolderRepository;
    private final PostRepository postRepository;
    private final FolderRepository folderRepository;
    private final GuestBookRepository guestBookRepository;
    private  final DiaryRepository diaryRepository;


    public HompyService(HompyRepository hompyRepository
            , FolderRepository hompyFolderRepository, PostRepository postRepository, FolderRepository folderRepository, GuestBookRepository guestBookRepository, DiaryRepository diaryRepository) {
        this.hompyRepository = hompyRepository;
        this.hompyFolderRepository = hompyFolderRepository;
        this.postRepository = postRepository;
        this.folderRepository = folderRepository;
        this.guestBookRepository = guestBookRepository;
        this.diaryRepository = diaryRepository;
    }

    public Hompy findById(Long id) {
        return hompyRepository.findById(id).orElse(null);
    }

    // 특정 User에 해당하는 Hompy 조회
    public Hompy findHompyByuser(User user) {
        return hompyRepository.findByUser(user);
    }

    // 기존 미니홈피 업데이트
    @Transactional
    public Hompy updateHompy(Hompy hompy) {
        Hompy originHompy = hompyRepository.findById(hompy.getId()).orElse(null);

        originHompy.setTitle(hompy.getTitle());
        originHompy.setMiniRoom(hompy.getMiniRoom());
        originHompy.setMinimiPicture(hompy.getMinimiPicture());
        originHompy.setMiniHompySkin(hompy.getMiniHompySkin());
        originHompy.setMiniHompyFont(hompy.getMiniHompyFont());
        originHompy.setMiniHompyBgm(hompy.getMiniHompyBgm());

        return hompyRepository.save(originHompy);
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
    public Hompy miniHompySkin(Long hompyId, String miniHompySkinPicture) {
        Hompy hompy = hompyRepository.findById(hompyId)
                .orElseThrow(() -> new RuntimeException("해당 ID의 홈피를 찾을 수 없습니다."));
        hompy.setMiniHompySkin(miniHompySkinPicture);
        return hompyRepository.save(hompy);
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
        String userMinimi;

        hompy.setProfilePicture("upload\\default_profile.png");
        hompy.setStatusMessage(null);
        hompy.setTodayVisitor(0L);
        hompy.setTotalVisitor(0L);
        hompy.setMiniHompySkin("background.png");
        hompy.setMiniRoom("miniroom.png");
        hompy.setProfile(null);
        hompy.setMenuColor("#147DAF");
        hompy.setMenuBorder("#000000");
        hompy.setMenuText("#FFF");
        hompy.setMiniHompyBgm("");
        hompy.setMenuStatus("visible,visible,visible,visible");

        if (hompy.getUser().getGender().equals("MALE")) {
            userMinimi = "male.png";
        } else {
            userMinimi="female.png";
        }
        hompy.setMinimiPicture(userMinimi);

        hompy = hompyRepository.saveAndFlush(hompy);
//        System.out.println(hompy);

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

    @Transactional(readOnly = true)
    public List<Post> hompyNewList(Hompy hompy, String action) {
        Pageable pageable = PageRequest.of(0, 5);

        boolean photoVisibleCheck = hompy.getMenuStatus().split(",")[0].equals("visible");
        boolean boardVisibleCheck = hompy.getMenuStatus().split(",")[1].equals("visible");
        boolean videoVisibleCheck = hompy.getMenuStatus().split(",")[2].equals("visible");

        List<String> folderStatus = (action.equals("OWNER") || action.equals("FRIEND")) ? List.of("전체공개", "일촌공개") : List.of("전체공개");
        List<String> boardTypeNames = new ArrayList<>();

        if(photoVisibleCheck){
            boardTypeNames.add("사진첩");
        }

        if(boardVisibleCheck){
            boardTypeNames.add("게시판");
        }

        if(videoVisibleCheck){
            boardTypeNames.add("동영상");
        }

        if(boardTypeNames.size() == 3){
            return postRepository.findByFolderHompyAndFolderStatusInOrderByIdDesc(hompy, pageable, folderStatus);
        }else {
            return postRepository.findByFolderHompyAndFolderBoardTypeNameInAndFolderStatusInOrderByIdDesc
                    (hompy, pageable, boardTypeNames, folderStatus);
        }

    }

    @Transactional(readOnly = true)
    public List<MiniHompyInfoCountDTO> hompyInfoPostCount(Hompy hompy, String action) {

        List<Post> postList = new ArrayList<>();
        List<MiniHompyInfoCountDTO> dtoList = new ArrayList<>();
        boolean visiblCheck;
        long today;
        long total;

        if (action.equals("OWNER") || action.equals("FRIEND")) {
            postList = postRepository.findByFolderHompyAndFolderStatusInOrderByIdDesc(hompy, List.of("전체공개", "일촌공개"));
        } else {
            postList = postRepository.findByFolderHompyAndFolderStatusInOrderByIdDesc(hompy, List.of("전체공개" ));
        }

        MiniHompyInfoCountDTO photo = new MiniHompyInfoCountDTO();
        visiblCheck = hompy.getMenuStatus().split(",")[0].equals("visible");
        if(visiblCheck){
            photo.setName("사진첩");

            today = postList.stream().filter(post -> post.getCreateAt().toLocalDate().equals(LocalDate.now()) && post.getFolder().getBoardType().getName().equals("사진첩")).count();
            photo.setToday(today);

            total = postList.stream().filter(post -> post.getFolder().getBoardType().getName().equals("사진첩")).count();
            photo.setTotal(total);

            dtoList.add(photo);
        }

        MiniHompyInfoCountDTO board = new MiniHompyInfoCountDTO();
        visiblCheck = hompy.getMenuStatus().split(",")[1].equals("visible");
        if(visiblCheck) {
            board.setName("게시판");

            today = postList.stream().filter(post -> post.getCreateAt().toLocalDate().equals(LocalDate.now()) && post.getFolder().getBoardType().getName().equals("게시판")).count();
            board.setToday(today);

            total = postList.stream().filter(post -> post.getFolder().getBoardType().getName().equals("게시판")).count();
            board.setTotal(total);
            dtoList.add(board);
        }

        MiniHompyInfoCountDTO video = new MiniHompyInfoCountDTO();
        visiblCheck = hompy.getMenuStatus().split(",")[2].equals("visible");
        if(visiblCheck) {
            video.setName("비디오");

            today = postList.stream().filter(post -> post.getCreateAt().toLocalDate().equals(LocalDate.now()) && post.getFolder().getBoardType().getName().equals("동영상")).count();
            video.setToday(today);

            total = postList.stream().filter(post -> post.getFolder().getBoardType().getName().equals("동영상")).count();
            video.setTotal(total);

            dtoList.add(video);
        }

        MiniHompyInfoCountDTO guest = new MiniHompyInfoCountDTO();
        visiblCheck = hompy.getMenuStatus().split(",")[3].equals("visible");
        if (visiblCheck){

            guest.setName("방명록");
            List<GuestBook> guestBookList = guestBookRepository.findByHompyId(hompy.getId());

            today = guestBookList.stream().filter(guestBook -> guestBook.getCreateAt().toLocalDate().equals(LocalDate.now())).count();
            guest.setToday(today);

            total = guestBookList.stream().count();
            guest.setTotal(total);

            dtoList.add(guest);
        }

        MiniHompyInfoCountDTO diary = new MiniHompyInfoCountDTO();
        List<Diary> diaryList = diaryRepository.findByHompyId(hompy.getId());

        diary.setName("다이어리");

        today = diaryList.stream().filter(diary1 -> diary1.getCreateAt().toLocalDate().equals(LocalDate.now())).count();
        diary.setToday(today);

        total = diaryList.stream().count();
        diary.setTotal(total);

        dtoList.add(diary);

        return dtoList;
    }


}
