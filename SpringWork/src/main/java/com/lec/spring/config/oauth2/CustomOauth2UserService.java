package com.lec.spring.config.oauth2;
import com.lec.spring.config.oauth2.provider.NaverUserInfo;
import com.lec.spring.config.oauth2.provider.OAuth2UserInfo;
import com.lec.spring.domain.CustomOAuth2User;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.service.HompyService;
import com.lec.spring.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class CustomOauth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;
    private final HompyService hompyService;

    public CustomOauth2UserService(UserService userService, HompyService hompyService) {
        this.userService = userService;
        this.hompyService = hompyService;
    }

    @Value("${app.oauth2.password}")
    private String oauth2Password;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("OAuth2UserService 호출!!");

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();


        OAuth2UserInfo oAuth2UserInfo = switch (registrationId.toLowerCase()) {
            case "naver" -> new NaverUserInfo(oAuth2User.getAttributes());
            default -> null;
        };


        String provider = oAuth2UserInfo.getProvider();
        String providerId = oAuth2UserInfo.getProviderId();
        String password = oauth2Password;
        String email = oAuth2UserInfo.getEmail();
        String username = provider + "_" + providerId;
        String name = oAuth2UserInfo.getName();
        String gender = oAuth2UserInfo.getGender();
        LocalDate birthDay = oAuth2UserInfo.getBirthDay();

//        System.out.println("provider: " + provider);
//        System.out.println("username" + username);

        User user = userService.findByUsername(username);
        Hompy hompy = new Hompy();
        if (user == null) {
            User newUser = User.builder()
                    .username(username.toUpperCase())
                    .password(password)
                    .email(email)
                    .name(name)
                    .role("ROLE_MEMBER")
                    .gender(gender)
                    .birthDay(birthDay)
                    .build();

//            User savedUser = userService.join(newUser);
            User savedUser = userService.join(newUser, provider);
            if (savedUser != null) {
                System.out.println("[OAuth2 인증. 회원가입 성공!]");

                user = userService.findByUsername(username);
                hompy = hompyService.findHompyByuser(user);

            } else {
                System.out.println("[OAau2 인증. 회원가입 실패]");
            }
        } else {
            System.out.println("[OAuth2 인증. 이미 가입된 회원입니다.]");
        }
        return new CustomOAuth2User(user,hompy);
    }
}
