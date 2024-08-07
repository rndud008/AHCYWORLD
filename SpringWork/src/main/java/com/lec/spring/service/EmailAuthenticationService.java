package com.lec.spring.service;

import com.lec.spring.domain.EmailAuthentication;
import com.lec.spring.domain.EmailDto;
import com.lec.spring.repository.EmailAuthenticationRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Properties;

@Service
public class EmailAuthenticationService {

    @Value("${app.from}")
    private String FROM;
    @Value("${app.password}")
    private String PASSWORD;

    private final EmailAuthenticationRepository emailAuthenticationRepository;
    private final UserRepository userRepository;

    public EmailAuthenticationService(EmailAuthenticationRepository emailAuthenticationRepository, UserRepository userRepository) {
        this.emailAuthenticationRepository = emailAuthenticationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EmailAuthentication save(EmailDto emailDto) {

        EmailAuthentication emailAuthentication = emailAuthenticationRepository.findByEmail(emailDto.getEmail()).orElse(new EmailAuthentication());

        String to = emailDto.getEmail();

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(FROM, PASSWORD);
            }
        });

        int random = (int) (Math.random() * 899999) + 100000;

        Message message = new MimeMessage(session);
        String authNumber = "인증번호 : " + random;

        try {
            message.setFrom(new InternetAddress(FROM));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject("아싸월드 이메일 인증");
            message.setText(authNumber);
            Transport.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        emailAuthentication.setEmail(to);
        emailAuthentication.setAuthenticationCode(String.valueOf(random));
        emailAuthentication.setStatus("인증전");

        emailAuthentication = emailAuthenticationRepository.save(emailAuthentication);

        return emailAuthentication;
    }

    @Transactional
    public EmailAuthentication check(EmailDto emailDto, EmailAuthentication emailAuthentication) {

        String dateTimeString = emailAuthentication.getCreateAt().toString();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS");
        LocalDateTime dateTime = LocalDateTime.parse(dateTimeString, formatter);

        LocalDateTime now = LocalDateTime.now();

        boolean authCheck = emailAuthentication.getAuthenticationCode().equals(emailDto.getAuthenticationCode());

        if (now.isBefore(dateTime) && authCheck) {
            emailAuthentication.setStatus("인증완료");
        } else {
            throw new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND));
        }

        return emailAuthentication;
    }

    @Transactional
    public int delete(EmailDto emailDto) {
        int result = 0;
        EmailAuthentication emailAuthentication = emailAuthenticationRepository
                .findByEmail(emailDto.getEmail()).orElse(null);

        if (emailAuthentication != null) {
            emailAuthenticationRepository.delete(emailAuthentication);
            result = 1;
        }

        return result;
    }

    public EmailAuthentication findByEmail(String email) {
        return emailAuthenticationRepository.findByEmail(email).orElse(null);
    }

}
