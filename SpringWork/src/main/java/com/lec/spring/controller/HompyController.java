package com.lec.spring.controller;

import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.repository.HompyRepository;
import com.lec.spring.service.HompyService;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hompy")
public class HompyController {

    @Value("${app.upload.path}")
    private String UPLOADDIR;
    private final HompyService hompyService;
    private final UserService userService;

    @Autowired
    public HompyController(HompyService hompyService, UserService userService) {
        this.hompyService = hompyService;
        this.userService = userService;
    }

    // 특정 User의 Hompy 조회
    @GetMapping("/{hompyId}")
    public Hompy HompyByUser(@PathVariable Long hompyId) {

        Hompy hompy = hompyService.findById(hompyId);

//        hompy.setUser(user); // hompy에 user 정보를 설정

        return hompy;
    }

    @GetMapping("/list")
    public List<Hompy> hompyList() {
        return hompyService.hompyList();

    }

    // userId 를 입력받아 해당 유저의 HompyId를 반환함.
    @GetMapping("/user/{userId}")
    public ResponseEntity<Long> getHompyIdByUserId(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);  // userId를 설정합니다.

        Hompy hompy = hompyService.findHompyByuser(user);
        if (hompy != null) {
            return ResponseEntity.ok(hompy.getId());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 프로필 이미지
    @PostMapping("/{hompyId}/profileImg")
    public ResponseEntity<?> updateProfileImg(@PathVariable Long hompyId, @RequestParam("file") MultipartFile file) {
        Hompy hompy = hompyService.findById(hompyId);

        String profilePicturePath = saveFile(file);

        hompyService.updateProfilePicture(hompy.getUser(), profilePicturePath);

        return ResponseEntity.ok().body(Map.of("profilePicture", profilePicturePath));
    }

    // 상태메시지
    @PostMapping("/{hompyId}/statusMessage")
    public ResponseEntity<?> updateStatusMessage(@PathVariable Long hompyId, @RequestBody Map<String, String> request) {
        String statusMessage = request.get("statusMessage");
        Hompy hompy = hompyService.findById(hompyId);

        hompyService.updateStatusMessage(hompy.getUser(), statusMessage);

        return ResponseEntity.ok().build();
    }

    // 파일 저장 메서드
    private String saveFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();

        Path filePath = Paths.get(UPLOADDIR, fileName);
        try {
            Files.write(filePath, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
        return filePath.toString();
    }

    @GetMapping("/profileImg/{filename:.+}")
    public ResponseEntity<?> imageFile(@PathVariable String filename) {

        File file = new File(UPLOADDIR + File.separator + filename);

        if (!file.exists()) {
            // 파일이 존재하지 않을 경우 기본 이미지로 대체
            file = new File(UPLOADDIR + File.separator + "default_profileImg.png"); // 기본 이미지 경로 설정
        }

        if (file.exists()) {
            FileSystemResource resource = new FileSystemResource(file);

            // 파일 확장자를 통해 Content-Type을 설정
            String contentType;
            try {
                contentType = Files.probeContentType(file.toPath());
            } catch (IOException e) {
                contentType = "application/octet-stream"; // 알 수 없는 경우 기본값 설정
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    // 메뉴 상태 및 색상 설정
    @PostMapping("/{hompyId}/menu")
    public Hompy updateMenu(
            @PathVariable Long hompyId,
            @RequestParam String menuColor,
            @RequestParam String menuStatus) {

        Hompy hompy = hompyService.findById(hompyId);

        return hompyService.menu(hompy.getUser(), menuColor, menuStatus);
    }

    // 방문자 수
    @PostMapping("/{hompyId}/visit")
    public ResponseEntity<Hompy> visitCnt(@PathVariable Long hompyId) {
        User user = hompyService.findById(hompyId).getUser();

        // 방문자 수 증가
        Hompy hompy = hompyService.visitCnt(user);

        return ResponseEntity.ok(hompy);
    }

    // 프로필 (간단한 자기소개?)
    @PostMapping("/{hompyId}/profile")
    public ResponseEntity<?> profile(@PathVariable Long hompyId, @RequestBody Map<String, String> profile) {
        User user = hompyService.findById(hompyId).getUser();

        String profileData = profile.get("profile"); // JSON의 "profile" 키에 접근
        hompyService.userProfile(user, profileData); // 프로필 저장 메소드 호출

        return ResponseEntity.ok(Map.of("profile", profileData));
    }

    // 미니미
    @PostMapping("/{hompyId}/minimi")
    public ResponseEntity<?> minimi(@PathVariable Long hompyId, @RequestPart("file") MultipartFile file) {
        User user = hompyService.findById(hompyId).getUser();

        String minimiPicturePath = saveFile(file);

        hompyService.minimi(user, minimiPicturePath);

        return ResponseEntity.ok().body(Map.of("minimiPicture", minimiPicturePath));
    }

    // 미니룸
    @PostMapping("/{hompyId}/miniroom")
    public ResponseEntity<?> miniroom(@PathVariable Long userId, @RequestPart("file") MultipartFile file) {
        User user = hompyService.findById(userId).getUser();

        String miniroomPicturePath = saveFile(file);

        hompyService.miniRoom(user, miniroomPicturePath);

        return ResponseEntity.ok().body(Map.of("miniroomPicture", miniroomPicturePath));
    }

    // 미니홈피 스킨
    @PostMapping("/{hompyId}/hompyskin")
    public ResponseEntity<?> homyskin(@PathVariable Long hompyId, @RequestPart("file") MultipartFile file) {
        User user = hompyService.findById(hompyId).getUser();

        String minihomeyskinPicturePath = saveFile(file);

        hompyService.miniHompySkin(user, minihomeyskinPicturePath);

        return ResponseEntity.ok().body(Map.of("minihomeyskinPicture", minihomeyskinPicturePath));
    }

    // 메뉴 상태 + 메뉴 색 바꾸기
    @PostMapping("/{hompyId}/setting")
    public ResponseEntity<Hompy> setting(@PathVariable Long hompyId, @RequestBody Hompy updateHompy) {
        // 기존 Hompy 객체를 가져옴
        Hompy hompy = hompyService.findById(hompyId);

        // hompyId로 Hompy 객체를 찾지 못한 경우
        if (hompy == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        User user = hompy.getUser();
        Long userId = user.getId();

        // 필요한 필드만 업데이트
        hompy.setMenuColor(updateHompy.getMenuColor());
        hompy.setMenuStatus(updateHompy.getMenuStatus());

        // 업데이트된 객체를 저장
        Hompy updatedHompy = hompyService.updateHompy(hompy);
        return ResponseEntity.ok(updatedHompy);
    }

    @PostMapping("/reset")
    public String reset(@RequestParam Long hompyId) {
        Hompy hompy = hompyService.findById(hompyId);
        System.out.println(hompy);
        if (hompy == null) {
            return "FAIL";
        }
        String result = hompyService.resetHompy(hompy);

        return result;
    }
}
