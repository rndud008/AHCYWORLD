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
    private final HompyService hompyService;


    public PrincipalDetailsService(UserService userService, HompyService hompyService) {
        this.userService = userService;
        this.hompyService = hompyService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userService.findByUsername(username);
        Hompy hompy = hompyService.findHompyByuser(user);

        if (user != null) {
            return new PrincipalDetails(user,hompy);
        }

        throw new UsernameNotFoundException(username);
    }
}
