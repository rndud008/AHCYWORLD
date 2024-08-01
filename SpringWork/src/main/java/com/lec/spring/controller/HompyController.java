package com.lec.spring.controller;

import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.service.HompyService;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

        return hompyService.findHompyByuser(user);
    }

    // 프로필 사진 및 상태 메시지 업데이트
    @PostMapping("/{userId}/profile")
    public Hompy updateProfile(
            @PathVariable Long userId,
            @RequestParam String profilePicture,
            @RequestParam String statusMessage ){

        User user = userService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("유저 아이디를 찾을 수 없습니다: " + userId));

        return hompyService.profile(user, profilePicture, statusMessage);
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
