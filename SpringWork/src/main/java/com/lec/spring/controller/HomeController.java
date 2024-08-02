package com.lec.spring.controller;

import com.lec.spring.config.PrincipalDetails;
import com.lec.spring.domain.User;
import com.lec.spring.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collection;
import java.util.stream.Collectors;

@RestController
public class HomeController {

    private final UserService userService;

    public HomeController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/admin")
    public String admin() {
        return "admin Page";
    }



    @GetMapping("/member")
    public String member() {
        return "member Page";
    }

    @RequestMapping("/user")
    public User user(@AuthenticationPrincipal PrincipalDetails userDetail) {
        Long userId = userDetail.getUser().getId();
        User user = userService.findByUserId(userId).orElse(null);

        return (user != null) ? user : null;
    }

    @RequestMapping("/auth")
    public Authentication auth() { // org.springframework.security.core.Authentication
        return SecurityContextHolder.getContext().getAuthentication();
    }

}
