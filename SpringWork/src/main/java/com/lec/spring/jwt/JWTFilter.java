package com.lec.spring.jwt;

import com.lec.spring.config.PrincipalDetails;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println("doFilterInternal");

        // Authorization 헤더에서 JWT를 가져온다.
        String authorization = request.getHeader("Authorization");

        // JWT가 없거나 잘못된 형식이면 필터 체인을 다음 필터로 넘기고 종료한다.
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Bearer 토크에서 실제 JWT 값을 출출
        String token = authorization.split(" ")[1];

        // JWT가 만료되었는지 확인하고, 만료되었으면 필터 체인을 다음 필터로 넘기고 종료
        if (jwtUtil.isExpired(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // JWT에서 사용자 정보 추출
        Long id = jwtUtil.getId((token));
        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);
        String name = jwtUtil.getName(token);
        Long hompyId = jwtUtil.getHompyId(token);
//        System.out.println(role);

        User user = User.builder()
                .id(id)
                .username(username)
                .password("temppassword")
                .role(role)
                .name(name)
                .build();

        Hompy hompy = Hompy.builder()
                .id(hompyId)
                .build();


        // 사용자와 홈피 정보를 기반으로 PrincipalDetails 객체를 생성
        PrincipalDetails userDetails = new PrincipalDetails(user,hompy);

        // PrincipalDetials 객체를 사용해 인증 토큰을 생성, 인증된 사용자의 권한 정보를 포함한다.
        Authentication authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        // 생성한 인증 토큰을 Spring Security의 SecurityContext에 설정하여, 현재 요청이 이증되었음을 알림
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
