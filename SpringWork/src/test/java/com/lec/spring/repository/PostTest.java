package com.lec.spring.repository;

import com.lec.spring.domain.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
class PostTest {

    @Autowired
    private BoardTypeRepository boardTypeRepository;
    @Autowired
    private HompyRepository hompyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FolderRepository folderRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private AttachmentRepository attachmentRepository;
    @Autowired
    private GuestBookRepository guestBookRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Test
    void test() {
        // --- 게시판 타입 생성.
//        BoardType boardType = new BoardType();
//        boardType.setName("게시판");
//
//        boardTypeRepository.save(boardType);
//
//        BoardType boardType1 = new BoardType();
//        boardType1.setName("사진첩");
//
//        boardTypeRepository.save(boardType1);
//
//        BoardType boardType2 = new BoardType();
//        boardType2.setName("동영상");
//
//        boardTypeRepository.save(boardType2);
//
//        boardTypeRepository.findAll().forEach(System.out::println);

        // --- user 생성.
//        User user = new User();
//
//        user.setUsername("k3");
//        user.setPassword(passwordEncoder.encode("1234"));
//        user.setName("testK3");
//        user.setEmail("test3@test.com");
//        user.setBirthDay(LocalDate.parse("1991-12-12"));
//        user.setGender("남자");
//        user.setRole("ROLE_MEMBER");
//
//        userRepository.save(user);
//
//        System.out.println(user);

        User user = userRepository.findById(5l).orElse(null);

//        Hompy hompy = new Hompy();
//        hompy.setUser(user);
//        hompy.setProfilePicture("1");
//        hompy.setStatusMessage("12");
//        hompy.setTitle(user.getName() + "의 아싸월드");
//        hompy.setProfile(user.getName() + "의 아싸월드 에 오신걸 환영합니다.");
        // 메뉴색상 default 색상 설정.
        // 메뉴상태 게시파 사진판,사진첩,동영상,방명록 default : visible

//        hompyRepository.save(hompy);
//        System.out.println(hompy);

//        Hompy hompy = hompyRepository.findByUser(user);

        Hompy hompy1 = hompyRepository.findById(1L).orElse(null);
        Hompy hompy2 = hompyRepository.findById(2L).orElse(null);
        Hompy hompy3 = hompyRepository.findById(3L).orElse(null);
        Hompy hompy4 = hompyRepository.findById(4L).orElse(null);
        Hompy hompy5 = hompyRepository.findById(5L).orElse(null);
        Hompy hompy6 = hompyRepository.findById(6L).orElse(null);
        Hompy hompy7 = hompyRepository.findById(7L).orElse(null);
        Hompy hompy8 = hompyRepository.findById(8L).orElse(null);

        BoardType boardType1 = new BoardType();

        Folder folder = new Folder();
        // 게시판 폴더

        folder.setHompy(hompy7);
        folder.setName("게시판 기본 폴더.");
        folder.setBoardType(boardTypeRepository.findById(1l).orElse(null));
        folderRepository.save(folder);

        Folder folder1 = new Folder();

        folder1.setHompy(hompy8);
        folder1.setName("사진첩 기본 폴더.");
        folder1.setBoardType(boardTypeRepository.findById(2l).orElse(null));
        folderRepository.save(folder1);

        Folder folder2 = new Folder();
        folder2.setHompy(hompy1);
        folder2.setName("동영상 기본 폴더.");
        folder2.setBoardType(boardTypeRepository.findById(3l).orElse(null));
        folderRepository.save(folder2);

//        folderRepository.findAll().forEach(System.out::println);

        //게시판 타입 -> 게시판
        Post post = new Post();
        post.setFolder(folder);
        post.setSubject("해성이가 집에 갔다.");
        post.setContent("집에서 얼마나 했을까?");

        postRepository.save(post);

        //게시판 타입 -> 사진첩
        Post post1 = new Post();
        post1.setFolder(folder1);
        post1.setSubject("해성이가 집에 갔다.");
        post1.setContent("집에서 얼마나 했을까?");

        postRepository.save(post1);
        // 사진첩 id 생성을 위해 먼저 저장.

        Attachment attachment = new Attachment();
        attachment.setPost(post1);
        attachment.setSourceName("1");
        attachment.setFileName("1-1");

        attachmentRepository.save(attachment);
        // 첨부파일 저장.

        post1.setFileList(attachmentRepository.findByPostId(post1.getId()));
        // 첨부파일 저장후 optional<List<Attachment>> 로 null 인지 check
        postRepository.save(post1);
        // post를 수정.

        //게시판 타입 -> 동영상
        Post post2 = new Post();
        post2.setFolder(folder2);
        post2.setSubject("해성이가 집에 갔다.");
        post2.setContent("집에서 얼마나 했을까?");

        postRepository.save(post2);
        // 동영상 id 생성을 위해 먼저 저장.

        Attachment attachment1 = new Attachment();
        attachment1.setPost(post2);
        attachment1.setSourceName("2");
        attachment1.setFileName("2-2");

        attachmentRepository.save(attachment1);
        // 첨부파일 저장.


        post2.setFileList(attachmentRepository.findByPostId(post2.getId()));
        // 첨부파일 저장후 optional<List<Attachment>> 로 null 인지 check
        postRepository.save(post2);
        // post를 수정.

    }

    @Test
    void test2(){
        Hompy hompy = hompyRepository.findById(2l).orElse(null);
//
//        List<Post> postList = postRepository.findByFolderHompyAndFolderStatusInOrderByIdDesc(hompy,List.of("전체공개","일촌공개"));
//        Long today = postList.stream().filter(post -> post.getCreateAt().toLocalDate().equals(LocalDate.now()) && post.getFolder().getBoardType().getName().equals("게시판")).count();
//        Long total = postList.stream().filter(post -> post.getFolder().getBoardType().getName().equals("게시판")).count();
//
//        System.out.println("total: " +total);
//        System.out.println("today: " +today);

        List<GuestBook> guestBookList = guestBookRepository.findByHompyId(hompy.getId());

        Long today = guestBookList.stream().filter(guestBook -> guestBook.getCreateAt().toLocalDate().equals(LocalDate.now())).count();
        Long total = guestBookList.stream().count();

        System.out.println("total: " + total);
        System.out.println("today: " + today);

    }

}