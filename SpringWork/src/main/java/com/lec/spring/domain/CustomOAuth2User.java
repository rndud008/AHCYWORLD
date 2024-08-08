package com.lec.spring.domain;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    private User user;
    private Hompy hompy;

    public User getUser() {
        return this.user = user;
    }
    public Hompy getHompy(){return this.hompy = hompy;}

    public CustomOAuth2User(User user, Hompy hompy) {
        this.user = user;
        this.hompy = hompy;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Map.of();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return user.getRole();
            }
        });

        return collection;
    }

    @Override
    public String getName() {
        return user.getName();
    }

    public String getUsername(){
        return user.getUsername();
    }
}
