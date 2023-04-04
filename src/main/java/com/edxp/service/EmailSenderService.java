package com.edxp.service;

import com.edxp.dto.request.UserCheckRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Slf4j
@RequiredArgsConstructor
@Service
public class EmailSenderService {
    private final JavaMailSender mailSender;

    public String sendEmail(UserCheckRequest request) {
        String authCode = createAuthKey();
        String subject = "엔지니어링 설계정보 디지털변환 클라우드 플랫폼 인증번호 메일";
        String body = "인증번호 코드: " + authCode;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("dxeng@wise.co.kr");
        message.setTo(request.getUsername());
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);

        log.info("Mail sent Successfully...");

        return authCode;
    }

    public Boolean sendEmailWithNewPassword(String email, String rawPassword) {
        String subject = "엔지니어링 설계정보 디지털변환 클라우드 플랫폼 비밀번호 초기화 메일";
        String body = "초기화 비밀번호: " + rawPassword;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("dxeng@wise.co.kr");
        message.setTo(email);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);

        System.out.println("Mail sent Successfully...");

        return true;
    }

    private String createAuthKey() {
        StringBuilder key = new StringBuilder();
        Random rnd = new Random();

        for (int i = 0; i < 8; i++) {
            int index = rnd.nextInt(3);

            switch (index) {
                case 0:
                    key.append((char) ((rnd.nextInt(26)) + 97));
                    break;
                case 1:
                    key.append((char) ((rnd.nextInt(26)) + 65));
                    break;
                case 2:
                    key.append(rnd.nextInt(10));
                    break;
            }
        }
        return key.toString();
    }
}
