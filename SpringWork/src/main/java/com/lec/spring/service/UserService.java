package com.lec.spring.service;

import com.lec.spring.domain.EmailAuthentication;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import com.lec.spring.repository.EmailAuthenticationRepository;
import com.lec.spring.repository.HompyRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Optional;

import java.time.LocalDate;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final HompyRepository hompyRepository;

    private final EmailAuthenticationRepository emailAuthenticationRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, HompyRepository hompyRepository, EmailAuthenticationRepository emailAuthenticationRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.hompyRepository = hompyRepository;
        this.emailAuthenticationRepository = emailAuthenticationRepository;
    }

    // 특정 ID로 User 조회
    public Optional<User> findByUserId(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User join(User user, String provider) {

        String username = user.getUsername();
        String password = user.getPassword();
        String email = user.getEmail();
        String name = user.getName();
        String gender = user.getGender();
        LocalDate birthDay = user.getBirthDay();

        if(provider == null){
            EmailAuthentication emailAuthentication = emailAuthenticationRepository.findByEmail(email).orElse(null);
            boolean authCheck = emailAuthentication !=null && emailAuthentication.getStatus().equals("인증완료");

            if(authCheck){
                emailAuthenticationRepository.delete(emailAuthentication);
            }else{
                return null;
            }
        }

        if (userRepository.existsByUsername(username)) {
            return null;
        }

        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email.toLowerCase());
        user.setName(name);
        user.setGender(gender);
        user.setBirthDay(birthDay);
        user.setRole("ROLE_MEMBER");

        User savedUser = userRepository.save(user);

        Hompy hompy = Hompy.builder()
                .user(savedUser)
                .title(name + "님의 미니홈피")
                .menuColor("#147DAF,#FFF,#147DAF")
                .menuStatus("visible,visible,visible,visible")
                .build();

        hompyRepository.save(hompy);
//        System.out.println("hompy만들었지롱~ " + hompy);
        return savedUser;
    }

    public User findByName(String name) {
        return userRepository.findByName(name);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username.toUpperCase());
    }

    public boolean usernameAvailable(String username) {
        return !userRepository.existsByUsername(username.toUpperCase());
    }

    public boolean emailAvailable(String email) {
        return !userRepository.existsByEmail(email.toUpperCase());
    }

    public List<User> list(){
        return userRepository.findAll();
    }

    public String OAuthAddInfo(String username, String gender, String birthday) {
//        System.out.println("username2: " + username);
//        System.out.println("gender2: " + gender);
//        System.out.println("birthDay2: " + birthday);

        User user = userRepository.findByUsername(username);

        LocalDate birthDay = LocalDate.parse(birthday);

        if (user != null) {
            user.setBirthDay(birthDay);
            user.setGender(gender);
            userRepository.save(user);
            return "ok";
        }

        return "ok";
    }

    @Transactional
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public void update(User user) {
        try {
            userRepository.save(user);
        }catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("유저 정보 업데이트 오류", e);
        }
    }
}
