package com.lec.spring.config;

import com.lec.spring.domain.User;
import org.hibernate.mapping.Array;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

// UserDetail 객체 생성
public class PrincipalDetails implements UserDetails {

    private User user;

    public User getUser() {
        return this.user;
    }

    // 일반 로그인 용 생성자
    public PrincipalDetails(User user) {
        System.out.println("UserDetails(user) 생성: " + user);
        this.user = user;
    }

    // GrantedAuthority : 사용자의 권한을 나타내는 인터페이스, 사용자가 가진 권한을 문자열로 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        System.out.println("getAuthorities() 호출");

        Collection<GrantedAuthority> collect = new ArrayList<>();

        // user.getRole() 은 현재 "ROLE_MEMBER,ROLE_ADMIN" 과 같은 형태이기에

        if (user.getRole() == null) return collect;

        // stream : 컬렉션, 배열 등의 데이터 소스를 처리하는 데 사용되는 API
        // 스트림을 사용하면 데이터를 필터링, 변환, 집계하는 등의 작업을 간결하고 직관적으로 수행할 수 있다.
        Arrays.stream(user.getRole().split(","))
                .forEach(auth -> collect.add(new GrantedAuthority() {
                    @Override
                    public String getAuthority() {
                        return auth.trim();
                    }

                    @Override
                    public String toString() {
                        return auth.trim();
                    }
                }));

        return collect;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
