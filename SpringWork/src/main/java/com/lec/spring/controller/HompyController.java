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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    @GetMapping("/{userId}")
    public Hompy HompyByUser(@PathVariable Long userId) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다: " + userId));

        Hompy hompy = hompyService.findHompyByuser(user);
        hompy.setUser(user); // hompy에 user 정보를 설정

        return hompy;
    }

    // 프로필 이미지
    @PostMapping("/{userId}/profileImg")
    public ResponseEntity<?> updateProfileImg(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다." + userId));

        String profilePicturePath = saveFile(file);

        hompyService.updateProfilePicture(user, profilePicturePath);

        return ResponseEntity.ok().body(Map.of("profilePicture", profilePicturePath));
    }

    // 상태메시지
    @PostMapping("/{userId}/statusMessage")
    public ResponseEntity<?> updateStatusMessage(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        String statusMessage = request.get("statusMessage");
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다. " + userId));

        hompyService.updateStatusMessage(user, statusMessage);

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
    @PostMapping("/{userId}/menu")
    public Hompy updateMenu(
            @PathVariable Long userId,
            @RequestParam String menuColor,
            @RequestParam String menuStatus) {

        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다: " + userId));

        return hompyService.menu(user, menuColor, menuStatus);
    }

    // 방문자 수
    @PostMapping("/{userId}/visit")
    public ResponseEntity<Hompy> visitCnt(@PathVariable Long userId) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다: " + userId));

        // 방문자 수 증가
        Hompy hompy = hompyService.visitCnt(user);

        return ResponseEntity.ok(hompy);
    }

    // 프로필 (간단한 자기소개?)
    @PostMapping("/{userId}/profile")
    public ResponseEntity<?> profile(@PathVariable Long userId, @RequestBody Map<String, String> profile) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다." + userId ));

        String profileData = profile.get("profile"); // JSON의 "profile" 키에 접근
        hompyService.userProfile(user, profileData); // 프로필 저장 메소드 호출

        return ResponseEntity.ok(Map.of("profile", profileData));
    }

    // 미니미
    @PostMapping("/{userId}/minimi")
    public ResponseEntity<?> minimi(@PathVariable Long userId, @RequestPart("file") MultipartFile file) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다." + userId));

        String minimiPicturePath = saveFile(file);

        hompyService.minimi(user, minimiPicturePath);

        return ResponseEntity.ok().body(Map.of("minimiPicture", minimiPicturePath));
    }

    // 미니룸
    @PostMapping("/{userId}/miniroom")
    public ResponseEntity<?> miniroom(@PathVariable Long userId, @RequestPart("file") MultipartFile file) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다." + userId));

        String miniroomPicturePath = saveFile(file);

        hompyService.miniRoom(user, miniroomPicturePath);

        return ResponseEntity.ok().body(Map.of("miniroomPicture", miniroomPicturePath));
    }

    // 미니홈피 스킨
    @PostMapping("/{userId}/homyskin")
    public ResponseEntity<?> homyskin(@PathVariable Long userId, @RequestPart("file") MultipartFile file) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다." + userId));

        String minihomeyskinPicturePath = saveFile(file);

        hompyService.miniHompySkin(user, minihomeyskinPicturePath);

        return ResponseEntity.ok().body(Map.of("minihomeyskinPicture", minihomeyskinPicturePath));
    }
}
