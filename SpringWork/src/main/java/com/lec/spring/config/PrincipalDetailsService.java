package com.lec.spring.config;

import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.service.HompyService;
import com.lec.spring.service.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PrincipalDetailsService implements UserDetailsService {

    private final UserService userService;


    public PrincipalDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userService.findByUsername(username);

        if (user != null) {
            return new PrincipalDetails(user);
        }

        throw new UsernameNotFoundException(username);
    }
}
