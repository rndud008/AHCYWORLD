package com.lec.spring.config.oauth2;

import com.lec.spring.domain.CustomOAuth2User;
import com.lec.spring.jwt.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Iterator;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    public CustomSuccessHandler(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        Long id = customOAuth2User.getUser().getId();
        String username = customOAuth2User.getUsername();
        String name = customOAuth2User.getName();
        Long hompyId = customOAuth2User.getHompy().getId();
        LocalDate birthDay = customOAuth2User.getUser().getBirthDay();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String token = jwtUtil.createJwt(id, hompyId, username, role, name, 30 * 60 * 1000L);


//        System.out.println("token:" + token);

        response.addHeader("Authorization", "Bearer " + token);
        response.addCookie(createCookie("accessToken", token));

        String redirectUrl;

        if (birthDay == null) {
            redirectUrl = "http://43.201.136.217:3000/addinfo";
        } else {
            redirectUrl = "http://43.201.136.217:3000/";
        }

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setPath("/");
        cookie.setHttpOnly(false);
        cookie.setMaxAge(60 * 60 * 24);

        return cookie;
    }
}
