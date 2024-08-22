package com.lec.spring.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lec.spring.domain.User;
import com.lec.spring.domain.oauth.KaKaoProfile;
import com.lec.spring.domain.oauth.KakaoOAuthToken;
import com.lec.spring.jwt.JWTUtil;
import com.lec.spring.service.HompyService;
import com.lec.spring.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Controller
@RequestMapping("/oauth2")
public class KakaoOAuth2Controller {

    @Value("${app.oauth2.kakao.client-id}")
    private String kakaoClientId;
    @Value("${app.oauth2.kakao.redirect-uri}")
    private String kakaoRedirectUri;
    @Value("${app.oauth2.kakao.token-uri}")
    private String kakaoTokenUri;
    @Value("${app.oauth2.kakao.user-info-uri}")
    private String kakaoUserInfoUri;

    @Value("${app.oauth2.password}")
    private String oauth2Password;


    private final UserService userService;
    private final HompyService hompyService;
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    public KakaoOAuth2Controller(UserService userService, AuthenticationManager authenticationManager
            , JWTUtil jwtUtil, HompyService hompyService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.hompyService = hompyService;
    }

    @GetMapping("/kakao/callback")
    public void kakaoCallBack(String code, HttpServletResponse response) throws IOException {
//        System.out.println("\n<<카카오 인증 완료>>\ncode: " + code);

        KakaoOAuthToken token = kakaoAccessToken(code);
        KaKaoProfile profile = kakaoUserInfo(token.getAccess_token());
        User kakaoUser = registerKakaoUser(profile);
        Long hompyId = hompyService.findHompyByuser(kakaoUser).getId();
        String jwtToken = jwtUtil.createJwt(
                kakaoUser.getId(),
                hompyId,
                kakaoUser.getUsername(),
                "ROLE_MEMBER",
                kakaoUser.getName(),
                60 * 60 * 1000L
        );

//        User user = userService.findByUsername()

        Cookie cookie = new Cookie("accessToken", jwtToken);
        cookie.setMaxAge(60 * 60);
        cookie.setPath("/");

        response.addCookie(cookie);

        if (kakaoUser.getBirthDay() == null) {
            response.sendRedirect("http://43.201.136.217:3000/addinfo");
        } else {

            response.sendRedirect("http://43.201.136.217:3000/");
        }
    }

    public KakaoOAuthToken kakaoAccessToken(String code) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", kakaoRedirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);
        ResponseEntity<String> response = rt.exchange(kakaoTokenUri, HttpMethod.POST, kakaoTokenRequest, String.class);

        ObjectMapper mapper = new ObjectMapper();
        KakaoOAuthToken token = null;

        try {
            token = mapper.readValue(response.getBody(), KakaoOAuthToken.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException();
        }

        return token;
    }

    public KaKaoProfile kakaoUserInfo(String accessToken) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        headers.add("Authorization", "Bearer " + accessToken);


        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response = rt.exchange(kakaoUserInfoUri, HttpMethod.POST, kakaoProfileRequest, String.class);

        ObjectMapper mapper = new ObjectMapper();
        KaKaoProfile profile = null;

        try {
            profile = mapper.readValue(response.getBody(), KaKaoProfile.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return profile;
    }

    public User registerKakaoUser(KaKaoProfile profile) {
        String provider = "kakao";
        String providerId = "" + profile.getId();
        String username = provider + "_" + providerId;
        String name = profile.getKakaoAccount().getProfile().getNickname();
        String password = oauth2Password;

        User user = userService.findByUsername(username);
        if (user == null) {
            User newUser = User.builder()
                    .username(username)
                    .name(name)
                    .password(password)
                    .email(providerId + "@kakao.com")
                    .role("ROLE_MEMBER")
                    .build();

            user = userService.join(newUser, provider);
            if (user != null) {
                user = userService.findByUsername(username);
            }
        }
        return user;
    }
}


