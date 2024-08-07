package com.edxp.user.service;

import com.edxp._core.constant.ErrorCode;
import com.edxp.user.dto.request.UserCheckRequest;
import com.edxp._core.handler.exception.EdxpApplicationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class UserMailAuthCodeService {
    private final ScheduledExecutorService scheduler;
    private final HashMap<String, String> authCodes;

    public UserMailAuthCodeService() {
        authCodes = new HashMap<>();
        scheduler = Executors.newScheduledThreadPool(1);
    }

    // 인증 코드 추가 메소드
    public void addAuthCode(UserCheckRequest request, String issuedCode) {
        log.info("인증코드: {}", issuedCode);
        String username = request.getUsername();

        authCodes.put(username, issuedCode);

        // 3분 후에 제거
        scheduler.schedule(() -> removeAuthCode(username), 3, TimeUnit.MINUTES);
    }

    // 인증 코드 확인 메소드
    public void getAuthCode(UserCheckRequest request) {
        String authCode = authCodes.get(request.getUsername());
        String userCode = request.getAuthCode();

        log.info("인증코드: {}, 유저입력코드: {}", authCode, userCode);

        boolean isAuthed = authCode.equals(userCode);
        if (!isAuthed) { throw new EdxpApplicationException(ErrorCode.INVALID_AUTH_CODE); }
    }

    // 인증 코드를 제거하는 메소드
    public void removeAuthCode(String username) {
        authCodes.remove(username);
    }
}
