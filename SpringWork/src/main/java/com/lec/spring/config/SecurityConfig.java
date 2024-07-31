package com.lec.spring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
//@EnableWebSecurity(debug = true)
@EnableWebSecurity
public class SecurityConfig {

    @Value("${cors.allowed-origins}")
    private List<String> corsAllowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // CSRF disable
        http.csrf((auth) -> auth.disable());

        // Form 로그인 disabled
        http.formLogin((auth) -> auth.disable());
        // http basic 인증 방식 disable
        http.httpBasic((auth) -> auth.disable());

        return http.build();
    }
}
