package com.lec.spring.jwt;

import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Date;

// JWT를 생성하고, 토큰에서 정보를 추출하여, 토큰이 만료되었는지 확인하는 유틸리티 클래스
// Spring Security를 사용한 애플리케이션에서 JWT를 통한 인증 및 권한 부여를 처리하는데 중요한 역할을 한다.
@Component
public class JWTUtil {

    private SecretKey secretKey;

    // 외부 설정파일(.yml)dptj jwt.secret 값을 읽어와, 이를 Secret 객체로 변환하여 secretKey 필드에 저장
    public JWTUtil(@Value("${jwt.secret}") String secret) {
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8)
                , Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    // 사용자 id, 홈피 id, 사용자 이름, 권한, 이름, 만료시간 등의 정보를 JWT의 클래임으로 설정
    public String createJwt(Long id, Long hompyId, String username, String role, String name, Long expiredMs) {
        return Jwts.builder()
                .claim("id", id)
                .claim("username", username)
                .claim("role", role)
                .claim("name", name)
                .claim("hompyId", hompyId)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))   // 토큰 만료 시간 설정
                .signWith(secretKey)
                .compact();
    }

    // 각 메서드는 토큰을 파싱하여 특정 클레임 값을 반환
    public Long getId(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("id", Long.class);
    }

    public Long getHompyId(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("id", Long.class);
    }

    public String getUsername(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("username", String.class);
    }

    public String getRole(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    public String getName(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("name", String.class);
    }

    // JWT 만료 여부 확인
    public Boolean isExpired(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    }
}
