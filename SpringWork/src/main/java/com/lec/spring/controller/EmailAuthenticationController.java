package com.lec.spring.controller;

import com.lec.spring.domain.EmailAuthentication;
import com.lec.spring.domain.EmailDto;
import com.lec.spring.service.EmailAuthenticationService;
import com.lec.spring.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailAuthenticationController {
    private final EmailAuthenticationService emailAuthenticationService;
    private final UserService userService;

    public EmailAuthenticationController(EmailAuthenticationService emailAuthenticationService, UserService userService) {
        this.emailAuthenticationService = emailAuthenticationService;
        this.userService = userService;
    }

    @PostMapping("/auth")
    public ResponseEntity<?> authResister(@RequestBody EmailDto emailDto) {
        if (!userService.emailAvailable(emailDto.getEmail())) {
            return new ResponseEntity<>("이미 존재하는 email 입니다.", HttpStatus.BAD_REQUEST);
        }

        try {
            return new ResponseEntity<>(emailAuthenticationService.save(emailDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("email 인증 오류발생", HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/auth/check")
    public ResponseEntity<?> authCheck(@RequestBody EmailDto emailDto) {

        EmailAuthentication emailAuthentication = emailAuthenticationService.findByEmail(emailDto.getEmail());
        if (emailAuthentication == null) {
            return new ResponseEntity<>("존재하지 않는 email 입니다, 다시한번 확인해주세요.",HttpStatus.NOT_FOUND);
        }

        try {
            return new ResponseEntity<>(emailAuthenticationService.check(emailDto,emailAuthentication), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("인증번호가 다릅니다 다시한번 확인해 주세요.", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/auth/delete")
    public ResponseEntity<?> authDelete(@RequestBody EmailDto emailDto){

        return new ResponseEntity<>(emailAuthenticationService.delete(emailDto),HttpStatus.OK);

    }

}
