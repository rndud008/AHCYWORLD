package com.lec.spring.jwt;

import com.lec.spring.config.PrincipalDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.stream.Collectors;

// UsernamePasswordAuthenticationFilter : 사용자가 로그인할 때의 인증 흐름을 커스터마이즈 할 수 있게 함
// 로그인 요청이 들어오면 사용자 이름과 비밀번호를 받아 인증을 시도하고, 인증이 성공하면 JWT를 생성하여 클라이언트에 반환
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;  // Spring Security 에서 인증을 관리하는 매니저, 사용자의 인증이 들어오면 이를 처리함
    private final JWTUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    // 사용자 로그인 시도 처리
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        // username과 password 추출
        String username = obtainUsername(request);
        String password = obtainPassword(request);

//        System.out.println("username:" + username + ", password: " + password);

        // 사용자의 인증정보를 캡슐화
        Authentication token = new UsernamePasswordAuthenticationToken(username.toUpperCase(), password, null);

        return authenticationManager.authenticate(token);
    }

    // 인증 성공한 후 호출
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        System.out.println("인증성공!");

//        인증된 사용자 정보를 담고 있는 PrincipalDetails 객체를 가져옴
        PrincipalDetails userDetails = (PrincipalDetails) authResult.getPrincipal();
        Long id = userDetails.getUser().getId();
        String username = userDetails.getUsername();
        String name = userDetails.getUser().getName();
        Long hompyId = userDetails.getHompy().getId();

        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        String role = authorities.stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.joining(","));

//        String token = jwtUtil.createJwt(id,hompyId, username, role, name,10000L);
        String token = jwtUtil.createJwt(id, hompyId, username, role, name, 24 * 60 * 60 * 1000L);

//        System.out.println("token:" + token);

//        System.out.println(role);

        response.addHeader("Authorization", "Bearer " + token);
    }
}
