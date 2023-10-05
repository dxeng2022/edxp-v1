package com.edxp.service;

import com.edxp._core.config.auth.PrincipalDetails;
import com.edxp._core.constant.ErrorCode;
import com.edxp._core.handler.exception.EdxpApplicationException;
import com.edxp.domain.SessionInfo;
import com.edxp.domain.UserEntity;
import com.edxp.domain.UserSession;
import com.edxp.dto.User;
import com.edxp.dto.request.UserChangeRequest;
import com.edxp.dto.request.UserCheckRequest;
import com.edxp.dto.request.UserFindRequest;
import com.edxp.dto.request.UserSignUpRequest;
import com.edxp.dto.response.UserFindResponse;
import com.edxp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import static com.edxp._core.common.utils.CreateKeyUtil.createPwKey;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailSenderService emailSenderService;
    private final SessionRegistry sessionRegistry;
    private final BCryptPasswordEncoder encoder;

    // 로그인 리스트 확인하기
    @Transactional(readOnly = true)
    public void getCurrentUsers() {
        List<UserSession> userSessions = sessionRegistry.getAllPrincipals().stream()
                .map(principal -> UserSession.builder()
                        .username(((PrincipalDetails) principal).getUsername())
                        .sessions(sessionRegistry.getAllSessions(principal,false)
                                .stream().map(si -> SessionInfo.builder()
                                        .lastRequest(si.getLastRequest())
                                        .principal((Principal) si.getPrincipal())
                                        .sessionId(si.getSessionId())
                                        .build()
                                ).collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        System.out.println(userSessions);

    }

    // 회원가입
    @Transactional
    public void createUser(UserSignUpRequest request) {
        userRepository.save(UserEntity.of(
                request.getUsername(),
                encoder.encode(request.getPassword()),
                request.getName(),
                request.getPhone(),
                request.getGender(),
                request.getBirth(),
                request.getOrganization(),
                request.getJob()
        ));
    }

    // 회원정보 변경
    @Transactional
    public User updateUser(Long userId, UserChangeRequest request) {
        UserEntity entity = userRepository.findById(userId).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND)
        );
        if (request.getNewPassword() != null) {
            entity.setPassword(encoder.encode(request.getNewPassword()));
        }
        if (request.getPhone() != null) {
            entity.setPhone(request.getPhone());
        }
        return User.fromEntity(entity);
    }

    // 이메일 중복확인
    @Transactional(readOnly = true)
    public void checkDuplicated(UserCheckRequest request) {
        userRepository.findByUsername(request.getUsername()).ifPresent(it -> {
            throw new EdxpApplicationException(ErrorCode.DUPLICATED_USER_NAME, String.format("%s is duplicated", request.getUsername()));
        });
    }

    // 이메일 찾기
    @Transactional(readOnly = true)
    public UserFindResponse findMail(UserFindRequest request) {
        UserEntity entity = userRepository.findByNameAndPhoneAndBirth(request.getName(), request.getPhone(), request.getBirth()).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND)
        );
        return new UserFindResponse(entity.getUsername());
    }

    // 비밀번호 찾기
    @Transactional
    public void findPw(UserFindRequest request) {
        UserEntity userEntity = userRepository.findByUsernameAndNameAndPhoneAndBirth(request.getUsername(), request.getName(), request.getPhone(), request.getBirth()).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND)
        );
        String rawPassword = createPwKey();
        boolean isSentEmail = emailSenderService.sendEmailWithNewPassword(request.getUsername(), rawPassword);
        if (isSentEmail) {
            log.info("초기화된 비밀번호: {}", rawPassword);
            String encPassword = encoder.encode(rawPassword);
            userEntity.setPassword(encPassword);
        } else {
            throw new EdxpApplicationException(ErrorCode.INTERNAL_SERVER_ERROR, "Sending mail is failed");
        }
    }

    // 회원 탈퇴
    @Transactional
    public void deleteUser(Long userId) {
        UserEntity entity = userRepository.findById(userId).orElseThrow(() ->
                new EdxpApplicationException(ErrorCode.USER_NOT_FOUND)
        );
        entity.setUsername(entity.getUsername() + "_deleted");
        entity.setDeletedAt(Timestamp.from(Instant.now()));
    }
}
