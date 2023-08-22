package com.edxp.service;

import com.edxp.constant.ErrorCode;
import com.edxp.dto.request.UserCheckRequest;
import com.edxp.exception.EdxpApplicationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class UserAuthService {
    private final ScheduledExecutorService scheduler;
    private final HashMap<String, String> authCodes;

    public UserAuthService() {
        authCodes = new HashMap<>();
        scheduler = Executors.newScheduledThreadPool(1);
    }

    // 인증 코드 추가 메소드
    public void addAuthCode(UserCheckRequest request, String issuedCode) {
        log.info("인증코드: {}", issuedCode);
        String userId = request.getUsername();

        authCodes.put(userId, issuedCode);

        // 3분 후에 제거
        scheduler.schedule(() -> removeAuthCode(userId), 3, TimeUnit.MINUTES);
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
    private void removeAuthCode(String userId) {
        authCodes.remove(userId);
    }
}
