package com.lec.spring.controller;

import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.service.HompyService;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/hompy")
public class HompyController {

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

//    // 프로필 사진 및 상태 메시지 업데이트
//    @PostMapping("/{userId}/profile")
//    public Hompy updateProfile(
//            @PathVariable Long userId,
//            @RequestParam String profilePicture,
//            @RequestParam String statusMessage ){
//
//        User user = userService.findByUserId(userId)
//                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다: " + userId));
//
//        return hompyService.updateUser(user, profilePicture, statusMessage);
//    }

    @PostMapping("/{userId}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam String statusMessage) {

        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다: " + userId));

        String profilePicturePath = saveFile(file);

        Hompy updatedHompy = hompyService.updateUser(user, profilePicturePath, statusMessage);

        return ResponseEntity.ok(updatedHompy);
    }

    // 파일 저장 메서드
    private String saveFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        Path filePath = Paths.get("path/to/save", fileName);
        try {
            Files.write(filePath, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
        return filePath.toString();
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
    public Hompy visitCnt(@PathVariable Long userId) {
        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다: " + userId));

        return hompyService.visitCnt(user);
    }
}
